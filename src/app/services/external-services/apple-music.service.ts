import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../syncify/auth.service';
import { DOCUMENT } from '@angular/common';
import {
  CustomDocument,
  DocumentRefService,
} from '../util/document-ref.service';
import { ScriptService } from '../util/scripts/script.service';
import { CustomWindow, WindowRefService } from '../util/window-ref.service';
import { UserService } from '../syncify/user.service';
import {
  catchError,
  defer,
  delayWhen,
  expand,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  of,
  reduce,
  ReplaySubject,
  retry,
  retryWhen,
  Subject,
  switchMap,
  take,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { TokenResponse } from '../../models/spotify-api.model';
import {
  AMSearchResults,
  AMTrack,
  AMTracks,
  ExpirationTimestamp,
  LibraryPlaylistsResponse,
  LibraryPlaylistsResponseWrapper,
  PlaylistSongsResponse,
} from '../../models/apple-music.model';
import { Song } from '../../models/music.model';
import { SearchResults } from '@spotify/web-api-ts-sdk';

@Injectable({
  providedIn: 'root',
})
export class AppleMusicService {
  private musicKit!: any;
  private window!: CustomWindow;
  private document!: CustomDocument;

  public musicKitInit$: Subject<boolean> = new Subject();
  public userTokenInit$: Subject<boolean> = new ReplaySubject(1);
  public newSongPlaying$: Subject<any> = new ReplaySubject(1);
  private musicKitInitialized = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private docRef: DocumentRefService,
    private scriptService: ScriptService,
    private windowRef: WindowRefService,
    private userService: UserService
  ) {}

  public init() {
    if (this.musicKitInitialized === true) {
      return;
    }

    this.loadMusicKitScript();

    this.document = this.docRef.customDocument;
    this.document.addEventListener('musickitloaded', async () => {
      this.window = this.windowRef.nativeWindow;

      this.userService.loggedInUser$
        .pipe(
          switchMap((user) => {
            return this.getDeveloperToken();
          })
        )
        .subscribe({
          next: async (token: string) => {
            try {
              await this.window.MusicKit.configure({
                developerToken: token,
                app: {
                  name: 'Syncify',
                  build: '0.1',
                },
                storefrontId: 'us',
              });
            } catch (err) {
              // Handle configuration error
              console.log(err);
            }

            // MusicKit instance is available
            this.musicKit = this.window.MusicKit.getInstance();
            console.log(this.musicKit);
            this.musicKitInitialized = true;
            this.musicKitInit$.next(this.musicKitInitialized);
          },
        });
    });
  }

  public alreadyAuthorized() {
    return this.musicKit.isAuthorized;
  }

  public startAuth() {
    return this.authorizeForUser().pipe(
      switchMap((done) => {
        localStorage.setItem('appleMusicUserToken', this.getUserToken());
        console.log(localStorage.getItem('appleMusicUserToken'));
        return this.authService.updateAppleMusicUserToken(this.getUserToken());
      })
    );
  }

  private authorizeForUser() {
    return defer(() => this.musicKit.authorize());
  }

  public getMusicKitInstance() {
    return this.musicKit;
  }

  private getUserToken() {
    return this.getMusicKitInstance().musicUserToken;
  }

  public setUserTokenFromStorage() {
    const userToken = localStorage.getItem('appleMusicUserToken');
    console.log(userToken);
    this.getMusicKitInstance().musicUserToken = userToken;
    console.log(this.getUserToken());
  }

  public setUserToken(token: string) {
    this.getMusicKitInstance().musicUserToken = token;
    console.log(this.getUserToken());
  }

  private getDeveloperToken() {
    return this.authService.appleMusicDeveloperToken().pipe(
      map((tokenResponse) => {
        return tokenResponse.token;
      })
    );
  }

  async loadMusicKitScript() {
    let data = await this.scriptService
      .load('appleMusicKit')
      .catch((error) => console.log(error));
    console.log('script loaded ', data);
  }

  public getPlaylistsOfCurrentUser() {
    return (
      defer(() =>
        this.musicKit.api.music('v1/me/library/playlists', {})
      ) as Observable<LibraryPlaylistsResponseWrapper>
    ).pipe(map((response) => response.data.data));
  }

  public getPlaylist(id: string) {
    return (
      defer(() =>
        this.musicKit.api.music(`v1/me/library/playlists/${id}`, {
          include: ['tracks'],
        })
      ) as Observable<LibraryPlaylistsResponseWrapper>
    ).pipe(map((response) => response.data.data));
  }

  private getSongsOfPlaylist(playlistId: string, nextUrlSection?: string) {
    let urlSection: string;
    if (nextUrlSection) {
      urlSection = nextUrlSection;
    } else {
      urlSection = `v1/me/library/playlists/${playlistId}/tracks`;
    }

    return (
      defer(() =>
        this.musicKit.api.music(urlSection, { limit: 100 })
      ) as Observable<PlaylistSongsResponse>
    ).pipe(map((response) => response.data));
  }

  public getAllSongsOfPlaylist(playlistId: string) {
    return this.getSongsOfPlaylist(playlistId).pipe(
      expand((tracksObj) =>
        tracksObj.next
          ? this.getSongsOfPlaylist(playlistId, tracksObj.next)
          : []
      ),
      reduce((acc: AMTracks, tracksObj) => {
        acc.data.push(...tracksObj.data);
        return acc;
      }),
      map((tracksObjAccumulator: AMTracks) => tracksObjAccumulator.data)
    );
  }

  public createPlaylist(name: string, description: string, songs: Song[]) {
    const searchRequests: Observable<AMTrack | null>[] = [];
    for (let song of songs) {
      searchRequests.push(
        this.searchCatalogForSong(song.name, song.artist, song.album)
      );
    }
    return forkJoin(searchRequests);
  }

  public searchCatalogForSong(
    title: string,
    artistName: string,
    albumName: string
  ): Observable<AMTrack | null> {
    //return defer(() =>
    return from(
      this.musicKit.api.music('v1/catalog/us/search', {
        term: title,
        limit: 10,
        types: ['songs'],
      })
    )
      .pipe(
        retry({
          count: 5,
          delay: (error, retryCount) => {
            console.log(error);
            console.log('THIS IS THE ERROR FROM 429');
            console.log(
              `Rate limit hit. Retrying in 10 seconds... (${retryCount}/5)`
            );
            return timer(10000);
          },
        })
      ) /* as Observable<AMSearchResults> */
      .pipe(
        map((searchResults: any) => {
          for (let result of searchResults.results.songs.data) {
            if (
              result.attributes.artistName === artistName ||
              result.attributes.albumName === albumName
            ) {
              return result;
            }
          }
          return null;
        })
        //filter((result) => result !== null)
      );
    // );
  }

  public async playSong(id: string) {
    await this.musicKit.setQueue({
      song: id,
    });
    this.newSongPlaying$.next(this.musicKit.nowPlayingItem);
    //this.musicKit.changeToMediaAtIndex(0);
  }

  public playTackAtQueueStart() {
    return defer(() => this.musicKit.changeToMediaAtIndex(0));
  }

  public async stopPlayer() {
    await this.musicKit.pause();
  }

  public getTrackPositionOfPlayingSong() {
    return this.musicKit.currentPlaybackTime;
  }

  getTrackDurationOfPlayingSong() {
    return this.musicKit.currentPlaybackDuration;
  }

  public formatImageUrl(url: string, width: number, height: number) {
    return url.replace('{w}x{h}', `${width}x${height}`);
  }
}
