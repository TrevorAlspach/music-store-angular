import { Injectable, OnInit } from '@angular/core';
import {
  AccessToken,
  AuthorizationCodeWithPKCEStrategy,
  MaxInt,
  Page,
  PlaybackState,
  PlaylistedTrack,
  SpotifyApi,
  Track,
} from '@spotify/web-api-ts-sdk';
import { environment } from '../../../environments/environment.development';
import {
  BehaviorSubject,
  concatMap,
  defer,
  EMPTY,
  expand,
  filter,
  from,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  tap,
  throwError,
  toArray,
} from 'rxjs';
import { SpotifyService } from './spotify.service';
import { SpotifyUser } from '../../models/spotify-api.model';
import { AuthService } from '../syncify/auth.service';
import { CustomWindow, WindowRefService } from '../util/window-ref.service';
import { ScriptService } from '../../scripts/script.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifySdkService {
  readonly clientId = environment.spotifyClientId;
  private window!: CustomWindow;
  private player!: Spotify.Player;

  public playerState$: Subject<Spotify.PlaybackState> = new Subject();
  public playerReady$: Subject<boolean> = new BehaviorSubject(false);

  deviceId!: string;

  sdk!: SpotifyApi;

  handleNoAccessToken$ = this.authService.getSpotifyRefreshToken().pipe(
    switchMap((tokenResponse) => {
      if (tokenResponse && tokenResponse.token) {
        const refreshToken = tokenResponse.token;
        return this.spotifyService.refreshAccessToken(refreshToken);
      } else {
        return throwError(() => console.log('refresh token not found'));
      }
    })
  );

  sdkReady$: Subject<boolean> = new ReplaySubject(1);

  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private windowRef: WindowRefService,
    private scriptService: ScriptService
  ) {
    console.log('sdk init');
    //need to find our access token or get one for the sdk
    const token = this.spotifyService.getFullAccessToken();
    console.log(token);
    console.log('above is token on init sdk');
    if (token) {
      this.createSdkFromAccessToken(token);
      //this.initWebPlayer();
    } else {
      this.handleNoAccessToken$.subscribe({
        next: (accessToken: AccessToken) => {
          this.createSdkFromAccessToken(accessToken);
          //this.initWebPlayer();
        },
        error: () => {
          //no refresh or access token
          console.log('no refresh or access token');
          this.sdkReady$.next(false);
        },
      });
    }
  }

  public getPlaylistsOfCurrentUser() {
    return defer(() => this.sdk.currentUser.playlists.playlists());
  }

  public getPlaylistFromId(playlistId: string) {
    return defer(() => this.sdk.playlists.getPlaylist(playlistId));
  }

  public deleteAllTracksFromPlaylist(playlistId: string) {
    return this.getAllTracksFromPlaylist(playlistId).pipe(
      concatMap((tracks: Track[]) => {
        console.log('in concat map');
        return this.deleteTracksInBatches(playlistId, tracks);
      })
    );
  }

  private getAllTracksFromPlaylist(playlistId: string): Observable<Track[]> {
    const limit = 50; // Spotify's limit for playlist tracks per request
    let offset = 0; // Start at the first track
    let allTracks: Track[] = [];

    // Fetch the first page of tracks
    return this.getPageOfPlaylistTracks(playlistId, limit, offset).pipe(
      expand((response: Page<PlaylistedTrack<Track>>) => {
        console.log('response below');
        console.log(response);
        allTracks = allTracks.concat(response.items.map((item) => item.track)); // Collect tracks

        // Check if there are more tracks to fetch
        offset += limit;
        if (offset < response.total) {
          return this.getPageOfPlaylistTracks(playlistId, limit, offset);
        } else {
          return EMPTY;
        }
      }),
      // Filter out the final null response and return all collected tracks
      map((response) =>
        response ? response.items.map((item) => item.track) : []
      ),
      toArray(), // Combine all emitted track arrays into a single array
      map(() => allTracks) // Return all collected tracks as a single array
    );
  }

  private getPageOfPlaylistTracks(
    playlistId: string,
    limit: MaxInt<50>,
    offset: number
  ): Observable<Page<PlaylistedTrack<Track>>> {
    return defer(() =>
      this.sdk.playlists.getPlaylistItems(
        playlistId,
        undefined,
        undefined,
        limit,
        offset
      )
    );
  }

  private deleteTracksInBatches(playlistId: string, tracks: Track[]) {
    const trackUris = tracks.map((track) => ({ uri: track.uri }));
    const batchSize = 100;
    const batches = [];

    // Split tracks into batches of 100
    for (let i = 0; i < trackUris.length; i += batchSize) {
      batches.push(trackUris.slice(i, i + batchSize));
    }

    // Send delete requests for each batch
    return from(batches).pipe(
      concatMap((batch) =>
        /* this.sdk.playlists.removeItemsFromPlaylist(playlistId, {
          tracks: batch,
        }) */
        this.removeBatchFromPlaylist(playlistId, batch)
      ),
      toArray() // Gather all responses
    );
  }

  private removeBatchFromPlaylist(playlistId: string, batch: any[]) {
    return defer(() =>
      this.sdk.playlists.removeItemsFromPlaylist(playlistId, {
        tracks: batch,
      })
    );
  }

  public getUserProfile() {
    //return defer(() => this.sdk.currentUser);
    return defer(() => this.sdk.currentUser.profile());
  }

  /**Wrap every used method from the sdk's promise with observable */
  public transferPlayback(deviceId: string): Observable<void> {
    return defer(() => this.sdk.player.transferPlayback([deviceId], true));
  }

  public startPlayback(trackUris: string[]) {
    return defer(() =>
      this.sdk.player.startResumePlayback(this.deviceId, undefined, trackUris)
    );
  }

  public getTrackInfo(id: string) {
    return defer(() => this.sdk.tracks.get(id));
  }

  public getPlaybackState(): Observable<PlaybackState> {
    return defer(() => this.sdk.player.getPlaybackState());
  }

  public getCurrentlyPlayingTrack(): Observable<PlaybackState> {
    return defer(() => this.sdk.player.getCurrentlyPlayingTrack());
  }

  public togglePlayer() {
    this.player.togglePlay();
  }

  public resumePlayer() {
    //this.player.resume();
  }

  public preparePlayer(contextUri?: string) {
    const webPlayerDeviceId = this.getWebPlayerDeviceId();
    return this.getPlaybackState().pipe(
      switchMap((playbackState) => {
        if (!playbackState) {
          return this.transferPlayback(webPlayerDeviceId).pipe(
            switchMap(() => this.getPlaybackState())
          );
        } else if (playbackState.device.id !== webPlayerDeviceId) {
          return this.transferPlayback(webPlayerDeviceId);
        } else {
          return of(playbackState);
        }
      }),
      switchMap((playback) => {
        return this.getPlayerState();
      })
    );
  }

  public nextTrack() {
    return defer(() => this.player.nextTrack());
  }

  public prevTrack() {
    return defer(() => this.player.previousTrack());
  }

  public adjustPlayerVolume(number: number) {
    this.player.setVolume(number);
  }

  public getPlayerState() {
    if (this.player) {
      //console.log('getplayerstate player is not nul')
      return defer(() => this.player.getCurrentState());
    } else {
      return of(null);
    }

    // return this.playerState$.
  }

  private initWebPlayer() {
    //Manually load the spotify web player sdk script. They need a npm package for this :/
    this.loadSpotifyWebPlayerScript();

    this.window = this.windowRef.nativeWindow;

    this.window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('spotify callback');
      //const token = this.getSpotifyAccessToken();
      this.getAccessTokenUsedByCurrentSdkInstance().subscribe((token) => {
        if (token) {
          console.log('player should be init now');
          this.player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: (cb) => {
              cb(token.access_token);
            },
            volume: 0.5,
          });

          this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.playerReady$.next(true);
            this.deviceId = device_id;
          });

          // Not Ready
          this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });

          this.player.addListener('initialization_error', ({ message }) => {
            console.error(message);
          });

          this.player.addListener('authentication_error', ({ message }) => {
            console.error(message);
          });

          this.player.addListener('account_error', ({ message }) => {
            console.error(message);
          });

          this.player.addListener('player_state_changed', (playbackState) => {
            //console.log(playbackState);
            this.playerState$.next(playbackState);
          });

          this.player.connect();
        } else {
          console.log(
            'no access token available cant create spotify web player'
          );
        }
      });
    };
  }

  async loadSpotifyWebPlayerScript() {
    let data = await this.scriptService
      .load('spotifyWebPlayer')
      .catch((error) => console.log(error));
    console.log('script loaded ', data);
  }

  public authenticate() {
    this.spotifyService.getAuthorizationCode();
  }

  public handleAuthCode(authCode: string) {
    return this.spotifyService.getAccessToken(authCode);
  }

  public getAccessTokenUsedByCurrentSdkInstance() {
    if (!this.sdk) {
      console.log('sdk not init yet');
      return throwError(() => 'sdk not init yet');
    }
    return defer(() => from(this.sdk.getAccessToken()));
  }

  public createSdkFromAccessToken(access_token: AccessToken) {
    this.sdk = SpotifyApi.withAccessToken(this.clientId, access_token);
    console.log('created spotify sdk with access token');
    this.initWebPlayer();
    this.sdkReady$.next(true);
  }

  public getWebPlayerDeviceId() {
    return this.deviceId;
  }
}
