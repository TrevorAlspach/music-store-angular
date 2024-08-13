import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { shareReplay } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TokenResponse } from '../models/spotify-api.model';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private auth0Service: Auth0Service
    //private appConfigService: AppConfigService
  ) {
    //this.apiBaseUrl = this.appConfigService.apiBaseUrl;
  }

  isTokenValid() {
    return this.http.get<boolean>(this.apiBaseUrl + 'auth/isTokenValid');
  }

  login(email: string, password: string) {
    return (
      this.http
        .post<User>(this.apiBaseUrl + 'auth/login', { email, password })
        // this is just the HTTP call,
        // we still need to handle the reception of the token
        .pipe(shareReplay())
    );
  }

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
}
          
