import { Injectable, OnInit } from '@angular/core';
import { AccessToken, AuthorizationCodeWithPKCEStrategy, PlaybackState, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, defer, from, Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { SpotifyUser } from '../models/spotify-api.model';
import { AuthService } from './auth.service';
import { CustomWindow, WindowRefService } from './window-ref.service';
import { ScriptService } from '../scripts/script.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifySdkService implements OnInit {
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
        return throwError(() => 'refresh token not found');
      }
    })
  );

  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private windowRef: WindowRefService,
    private scriptService: ScriptService
  ) {
    //need to find our access token or get one for the sdk
    const token = this.spotifyService.getFullAccessToken();
    if (token) {
      this.createSdkFromAccessToken(token);
      this.initWebPlayer();
    } else {
      this.handleNoAccessToken$.subscribe({
        next: (accessToken: AccessToken) => {
          this.createSdkFromAccessToken(accessToken);
          this.initWebPlayer();
        },
        error: () => {
          //no refresh or access token
          console.log('no refresh or access token');
        },
      });
    }
  }

  ngOnInit(): void {}

  /**Wrap every used method from the sdk's promise with observable */
  public transferPlayback(deviceId: string): Observable<void> {
    return defer(() => this.sdk.player.transferPlayback([deviceId], true));
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

  public nextTrack() {
    return defer(() =>this.player.nextTrack());

  }

  public prevTrack() {
    return defer(() =>this.player.previousTrack());
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
          console.log('player should be init now')
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
  }

  public getWebPlayerDeviceId() {
    return this.deviceId;
  }
}
