import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectedService, User } from '../../models/user.model';
import { shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenResponse } from '../../models/spotify-api.model';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth0Service: Auth0Service) {}

  isTokenValid() {
    return this.http.get<boolean>(this.apiBaseUrl + 'auth/isTokenValid');
  }

  /*   login(email: string, password: string) {
    return (
      this.http
        .post<User>(this.apiBaseUrl + 'auth/login', { email, password })
        // this is just the HTTP call,
        // we still need to handle the reception of the token
        .pipe(shareReplay())
    );
  } */

  logout() {
    localStorage.clear();
    return this.auth0Service.logout();
  }

  signupUser(email: string, password: string, username: string) {
    return this.http.post<User>(this.apiBaseUrl + 'auth/signup', {
      email,
      password,
      username,
      roles: 'USER',
    });
  }

  connectedServices() {
    return this.http.get<ConnectedService[]>(
      this.apiBaseUrl + 'api/user/connectedServices'
    );
  }

  getSpotifyRefreshToken() {
    return this.http.get<TokenResponse>(
      this.apiBaseUrl + 'api/user/spotifyRefreshToken'
    );
  }

  updateSpotifyRefreshToken(token: string) {
    return this.http.post<any>(
      this.apiBaseUrl + 'api/user/spotifyRefreshToken',
      {
        token: token,
      }
    );
  }

  removeSpotifyRefreshToken() {
    return this.http.post<any>(
      this.apiBaseUrl + 'api/user/spotifyRefreshToken',
      {
        token: null,
      }
    );
  }

  getAppleMusicRefreshToken() {
    return this.http.get<TokenResponse>(
      this.apiBaseUrl + 'api/user/appleMusicRefreshToken'
    );
  }

  updateAppleMusicRefreshToken(token: string) {
    return this.http.post<any>(
      this.apiBaseUrl + 'api/user/appleMusicRefreshToken',
      {
        token: token,
      }
    );
  }

  removeAppleMusicRefreshToken() {
    return this.http.post<any>(
      this.apiBaseUrl + 'api/user/appleMusicRefreshToken',
      {
        token: null,
      }
    );
  }

  getTidalRefreshToken() {
    return this.http.get<TokenResponse>(
      this.apiBaseUrl + 'api/user/tidalRefreshToken'
    );
  }

  updateTidalRefreshToken(token: string) {
    return this.http.post<any>(this.apiBaseUrl + 'api/user/tidalRefreshToken', {
      token: token,
    });
  }

  removeTidalRefreshToken() {
    return this.http.post<any>(this.apiBaseUrl + 'api/user/tidalRefreshToken', {
      token: null,
    });
  }
}
