import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { SpotifyPlaylistResponse, SpotifyPlaylistsResponse, SpotifyTracksObject, SpotifyUser, TokenResponse } from '../models/spotify-api.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  readonly clientId = environment.spotifyClientId;
  readonly redirectUri = environment.spotifyRedirectUrl;

  readonly scope = 'user-read-private user-read-email';
  readonly authUrl = new URL(environment.spotifyAuthUrl);
  readonly tokenUrl = environment.spotifyTokenUrl;

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
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      );
  }

  getSongsOfPlaylist(id: string, pageSize: number = 50, offset: number = 0): Observable<SpotifyTracksObject>{
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
                }
                return throwError(err);
              })
            );
          }
          return throwError(error);
        })
      );
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
