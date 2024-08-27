import { Injectable, OnInit } from '@angular/core';
import { AccessToken, AuthorizationCodeWithPKCEStrategy, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environments/environment.development';
import { defer, from, Observable, switchMap, throwError } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { SpotifyUser } from '../models/spotify-api.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifySdkService implements OnInit {
  readonly clientId = environment.spotifyClientId;
  /* emptyUser = <SpotifyUser>{
    id: '',
  }; */

  sdk!: SpotifyApi;

  handleNoAccessToken$ = this.authService
    .getSpotifyRefreshToken()
    .pipe(
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
    private authService: AuthService
  ) {
    //need to find our access token or get one for the sdk
    const token = this.spotifyService.getFullAccessToken();
    if (token) {
      this.createSdkFromAccessToken(token);
    } else {
      this.handleNoAccessToken$.subscribe({
        next: (accessToken: AccessToken) => {
          this.createSdkFromAccessToken(accessToken);
        },
        error: () => {
          //no refresh or access token
          console.log('no refresh or access token');
        },
      });
    }
  }

  ngOnInit(): void {
  }

  public authenticate() {
    this.spotifyService.getAuthorizationCode();
  }

  public handleAuthCode(authCode: string) {
    return this.spotifyService.getAccessToken(authCode);
  }

  public getAccessTokenUsedByCurrentSdkInstance(){
    if (!this.sdk){
      console.log('sdk not init yet');
      return throwError(() => 'sdk not init yet');
    }
    return defer(()=>from(this.sdk.getAccessToken()));
  }

  public createSdkFromAccessToken(access_token: AccessToken) {
    this.sdk = SpotifyApi.withAccessToken(this.clientId, access_token);
    console.log('created spotify sdk with access token');
  }
}
