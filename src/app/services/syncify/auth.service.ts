import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectedService, User } from '../../models/user.model';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenResponse } from '../../models/spotify-api.model';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { ExpirationTimestamp } from '../../models/apple-music.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth0Service: Auth0Service) {}

  logout() {
    //localStorage.clear();
    return this.auth0Service.logout({});
  }

  signupUser(email: string, password: string, username: string) {
    return this.http.post<User>(this.apiBaseUrl + 'auth/signup', {
      email,
      password,
      username,
      roles: 'USER',
    });
  }

  appleMusicDeveloperToken() {
    return this.http.get<TokenResponse>(
      this.apiBaseUrl + 'auth/appleMusicDeveloperToken'
    );
  }

  connectedServices() {
    return this.http.get<ConnectedService[]>(
      this.apiBaseUrl + 'user/connectedServices'
    );
  }

  getSpotifyRefreshToken() {
    return this.http.get<TokenResponse>(
      this.apiBaseUrl + 'user/spotifyRefreshToken'
    );
  }

  updateSpotifyRefreshToken(token: string) {
    return this.http.post<any>(this.apiBaseUrl + 'user/spotifyRefreshToken', {
      token: token,
    });
  }

  removeSpotifyRefreshToken() {
    return this.http.post<any>(this.apiBaseUrl + 'user/spotifyRefreshToken', {
      token: null,
    });
  }

  getAppleMusicUserTokenExpiration() {
    return this.http.get<ExpirationTimestamp>(
      this.apiBaseUrl + 'user/appleMusicUserToken'
    );
  }

  updateAppleMusicUserTokenExpiration(): Observable<ExpirationTimestamp> {
    let now = new Date();
    now.setTime(now.getTime() + 3600 * 1000);
    let timestamp = now.getTime();

    return this.http.post<ExpirationTimestamp>(
      this.apiBaseUrl + 'user/appleMusicUserToken',
      <ExpirationTimestamp>{
        expiresAt: timestamp,
      }
    );
  }

  removeAppleMusicUserToken() {
    return this.http.post<any>(
      this.apiBaseUrl + 'user/appleMusicRefreshToken',
      {
        token: null,
      }
    );
  }

  getTidalRefreshToken() {
    return this.http.get<TokenResponse>(
      this.apiBaseUrl + 'user/tidalRefreshToken'
    );
  }

  updateTidalRefreshToken(token: string) {
    return this.http.post<any>(this.apiBaseUrl + 'user/tidalRefreshToken', {
      token: token,
    });
  }

  removeTidalRefreshToken() {
    return this.http.post<any>(this.apiBaseUrl + 'user/tidalRefreshToken', {
      token: null,
    });
  }
}
