import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import {
  Observable,
  catchError,
  concatMap,
  count,
  delay,
  forkJoin,
  from,
  map,
  of,
  retry,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import {
  SpotifyPlaylistResponse,
  SpotifyPlaylistsResponse,
  SpotifyTracksObject,
  SpotifyUser,
  TokenResponse,
  TracksSearchResponse,
} from '../models/spotify-api.model';
import { Song } from '../models/music.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  readonly clientId = environment.spotifyClientId;
  readonly redirectUri = environment.spotifyRedirectUrl;

  readonly scope =
    'user-read-private user-read-email playlist-modify-private playlist-modify-public';
  readonly authUrl = new URL(environment.spotifyAuthUrl);
  readonly tokenUrl = environment.spotifyTokenUrl;

  private authenticatedUser!: SpotifyUser;

  emptyUser = <SpotifyUser>{
    id: '',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPlaylistsOfLoggedInUser(): Observable<SpotifyPlaylistsResponse> {
    return this.http
      .get<SpotifyPlaylistsResponse>(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.getStoredAccessToken()}`,
          }),
          params: {
            limit: 100,
          },
        }
      )
      .pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return this.authService.getSpotifyRefreshToken().pipe(
              switchMap((tokenResponse) => {
                const refreshToken = tokenResponse.token;
                return this.refreshAccessToken(refreshToken);
              }),
              switchMap(() => {
                console.log(
                  'access token here is' + this.getStoredAccessToken()
                );
                return this.http.get<any>(
                  'https://api.spotify.com/v1/me/playlists',
                  {
                    headers: new HttpHeaders({
                      Authorization: `Bearer ${this.getStoredAccessToken()}`,
                    }),
                  }
                );
              }),
              catchError((err) => {
                if (
                  err.status === HttpStatusCode.Unauthorized ||
                  err.status === HttpStatusCode.BadRequest
                ) {
                  //this.getAuthorizationCode();
                  console.log(err);
                  this.authenticatedUser = this.emptyUser;
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      );
  }

  getPlaylistFromId(id: string): Observable<SpotifyPlaylistResponse> {
    return this.http
      .get<SpotifyPlaylistResponse>(
        `https://api.spotify.com/v1/playlists/${id}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.getStoredAccessToken()}`,
          }),
        }
      )
      .pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return this.authService.getSpotifyRefreshToken().pipe(
              switchMap((tokenResponse) => {
                const refreshToken = tokenResponse.token;
                return this.refreshAccessToken(refreshToken);
              }),
              switchMap(() => {
                console.log(
                  'access token here is' + this.getStoredAccessToken()
                );
                return this.http.get<any>(
                  `https://api.spotify.com/v1/playlists/${id}`,
                  {
                    headers: new HttpHeaders({
                      Authorization: `Bearer ${this.getStoredAccessToken()}`,
                    }),
                  }
                );
              }),
              catchError((err) => {
                if (
                  err.status === HttpStatusCode.Unauthorized ||
                  err.status === HttpStatusCode.BadRequest
                ) {
                  //this.getAuthorizationCode();
                  console.log(err);
                  this.authenticatedUser = this.emptyUser;
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      );
  }

  createPlaylist(name: string, description: string, songs: Song[]) {
    return this.http
      .post<SpotifyPlaylistResponse>(
        `https://api.spotify.com/v1/users/${this.authenticatedUser.id}/playlists`,
        {
          name: name,
          description: description,
          public: true,
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.getStoredAccessToken()}`,
          }),
        }
      )
      .pipe(
        switchMap((createdPlaylist) => {
          if (songs.length > 0) {
            return this.addSongsToPlaylist(songs, createdPlaylist.id);
          } else {
            return of(createdPlaylist);
          }
        })
      )
      .pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return this.authService.getSpotifyRefreshToken().pipe(
              switchMap((tokenResponse) => {
                const refreshToken = tokenResponse.token;
                return this.refreshAccessToken(refreshToken);
              }),
              switchMap(() => {
                console.log(
                  'access token here is' + this.getStoredAccessToken()
                );
                return this.http.post<any>(
                  `https://api.spotify.com/v1/users/${this.authenticatedUser.id}/playlists`,
                  {
                    headers: new HttpHeaders({
                      Authorization: `Bearer ${this.getStoredAccessToken()}`,
                    }),
                  }
                );
              }),
              catchError((err) => {
                if (
                  err.status === HttpStatusCode.Unauthorized ||
                  err.status === HttpStatusCode.BadRequest
                ) {
                  //this.getAuthorizationCode();
                  console.log(err);
                  this.authenticatedUser = this.emptyUser;
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      );
  }

  addSongsToPlaylist(songs: Song[], playlistId: string): Observable<SpotifyPlaylistResponse> {
    const errors = [];
    const searchRequests: Observable<TracksSearchResponse>[] = [];
    for (let song of songs) {
      searchRequests.push(
        this.searchForTrack(song.name, song.artist, song.album)
      );
    }

    return forkJoin(searchRequests)
      .pipe(
        map((searchResponses) => {
          const batchSize = 100;
          const tracksToAdd = [];
          const batchedTracks = [];
          for (let response of searchResponses) {
            if (response.tracks.items.length > 0) {
              console.log(response.tracks.items);
              tracksToAdd.push(response.tracks.items[0].uri);
            } else {
              //handle bad
            }
          }
          for (let i = 0; i < tracksToAdd.length; i += batchSize) {
            batchedTracks.push(tracksToAdd.slice(i, i + batchSize));
          }
          return batchedTracks;
        })
      )
      .pipe(
        concatMap((batches) =>
          from(batches).pipe(
            concatMap((batch) => this.addBatchToPlaylist(batch, playlistId))
          )
        )
      ).pipe(switchMap(()=>this.getPlaylistFromId(playlistId)));
  }

  addBatchToPlaylist(batch: string[], playlistId: string){
    return this.http.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: batch,
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.getStoredAccessToken()}`,
        }),
      }
    );
  }

  searchForTrack(
    title: string,
    artistName: string,
    albumName: string
  ): Observable<TracksSearchResponse> {
    const query = `track:${title} artist:${artistName} album:${albumName}`;
    return this.http
      .get<TracksSearchResponse>(`https://api.spotify.com/v1/search`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.getStoredAccessToken()}`,
        }),
        params: new HttpParams()
          .set('q', encodeURIComponent(query))
          .set('market', 'US')
          .set('limit', '1')
          .set('type', 'track'),
      })
      .pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return this.authService.getSpotifyRefreshToken().pipe(
              switchMap((tokenResponse) => {
                const refreshToken = tokenResponse.token;
                return this.refreshAccessToken(refreshToken);
              }),
              switchMap(() => {
                console.log(
                  'access token here is' + this.getStoredAccessToken()
                );
                return this.http.get<any>(`https://api.spotify.com/v1/search`, {
                  headers: new HttpHeaders({
                    Authorization: `Bearer ${this.getStoredAccessToken()}`,
                  }),
                });
              }),
              catchError((err) => {
                if (
                  err.status === HttpStatusCode.Unauthorized ||
                  err.status === HttpStatusCode.BadRequest
                ) {
                  //this.getAuthorizationCode();
                  console.log(err);
                  this.authenticatedUser = this.emptyUser;
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      )
      .pipe(
        retry({
          count: 5,
          delay: (error, retryCount) => {
            if (error.status === 429) {
              console.warn(
                `Rate limit hit. Retrying in 10 seconds... (${
                  retryCount + 1
                }/3)`
              );
              return timer(10000);
            } else {
              return throwError(error);
            }
          },
        })
      );
  }

  getSongsOfPlaylist(
    id: string,
    pageSize: number = 50,
    offset: number = 0
  ): Observable<SpotifyTracksObject> {
    return this.http
      .get<SpotifyTracksObject>(
        `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${pageSize}&offset=${offset}`,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.getStoredAccessToken()}`,
          }),
        }
      )
      .pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return this.authService.getSpotifyRefreshToken().pipe(
              switchMap((tokenResponse) => {
                const refreshToken = tokenResponse.token;
                return this.refreshAccessToken(refreshToken);
              }),
              switchMap(() => {
                console.log(
                  'access token here is' + this.getStoredAccessToken()
                );
                return this.http.get<any>(
                  `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${pageSize}&offset=${offset}`,
                  {
                    headers: new HttpHeaders({
                      Authorization: `Bearer ${this.getStoredAccessToken()}`,
                    }),
                  }
                );
              }),
              catchError((err) => {
                if (
                  err.status === HttpStatusCode.Unauthorized ||
                  err.status === HttpStatusCode.BadRequest
                ) {
                  //this.getAuthorizationCode();
                  console.log(err);
                  this.authenticatedUser = this.emptyUser;
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      );
  }

  getUserProfile(): Observable<SpotifyUser> {
    return this.http
      .get<any>('https://api.spotify.com/v1/me', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.getStoredAccessToken()}`,
        }),
      })
      .pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            return this.authService.getSpotifyRefreshToken().pipe(
              switchMap((tokenResponse) => {
                const refreshToken = tokenResponse.token;
                return this.refreshAccessToken(refreshToken);
              }),
              switchMap(() => {
                console.log(
                  'access token here is' + this.getStoredAccessToken()
                );
                return this.http.get<any>('https://api.spotify.com/v1/me', {
                  headers: new HttpHeaders({
                    Authorization: `Bearer ${this.getStoredAccessToken()}`,
                  }),
                });
              }),
              catchError((err) => {
                if (
                  err.status === HttpStatusCode.Unauthorized ||
                  err.status === HttpStatusCode.BadRequest
                ) {
                  //this.getAuthorizationCode();
                  console.log(err);
                  this.authenticatedUser = this.emptyUser;
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      )
      .pipe(tap((userProfile) => (this.authenticatedUser = userProfile)));
  }

  getAccessToken(authCode: string) {
    const codeVerifier = localStorage.getItem('code_verifier') as string;

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('grant_type', 'authorization_code');
    body.set('code', authCode);
    body.set('redirect_uri', this.redirectUri);
    body.set('code_verifier', codeVerifier);

    return this.http
      .post<any>(this.tokenUrl, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        switchMap((response) =>
          this.storeAccessAndRefreshToken(
            response['access_token'],
            response['refresh_token']
          ).pipe(switchMap(() => of(response)))
        )
      );
  }

  disconnectAccount() {
    this.authenticatedUser = this.emptyUser;
    localStorage.clear();
    this.authService.removeSpotifyRefreshToken().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  refreshAccessToken(refreshToken: string) {
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);
    body.set('client_id', this.clientId);

    return this.http
      .post<any>(this.tokenUrl, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        switchMap((response) =>
          this.storeAccessAndRefreshToken(
            response['access_token'],
            response['refresh_token']
          ).pipe(switchMap(() => of(response)))
        )
      );
  }

  storeAccessAndRefreshToken(accessToken: string, refreshToken: string) {
    console.log('storing tokens function');
    localStorage.setItem('spotify_access_token', accessToken);
    return this.authService.updateSpotifyRefreshToken(refreshToken);
  }

  generateRandomString(length: number): string {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  async sha256(plaintext: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  async getAuthorizationCode() {
    const codeVerifier = this.generateRandomString(64);
    const hashedVerifier = await this.sha256(codeVerifier);
    const codeChallenge = this.base64encode(hashedVerifier);

    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUri,
    };

    this.authUrl.search = new URLSearchParams(params).toString();
    window.location.href = this.authUrl.toString();

    //const urlParams = new URLSearchParams(window.location.search);
    //let code = urlParams.get('code');
    //console.log(code)
  }

  getStoredAccessToken() {
    return localStorage.getItem('spotify_access_token');
  }

  private catchErrorOperator(err: any) {
    return catchError((error) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        return this.authService.getSpotifyRefreshToken().pipe(
          switchMap((tokenResponse) => {
            const refreshToken = tokenResponse.token;
            return this.refreshAccessToken(refreshToken);
          }),
          switchMap(() => {
            console.log('access token here is' + this.getStoredAccessToken());
            return this.http.get<any>(
              'https://api.spotify.com/v1/me/playlists',
              {
                headers: new HttpHeaders({
                  Authorization: `Bearer ${this.getStoredAccessToken()}`,
                }),
              }
            );
          }),
          catchError((err) => {
            if (
              err.status === HttpStatusCode.Unauthorized ||
              err.status === HttpStatusCode.BadRequest
            ) {
              //this.getAuthorizationCode();
              console.log(err);
            }
            return throwError(err);
          })
        );
      }
      return throwError(error);
    });
  }
}
