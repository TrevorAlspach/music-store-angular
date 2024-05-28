import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { shareReplay } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient //private appConfigService: AppConfigService
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
    return this.http.post<any>(this.apiBaseUrl + 'auth/logout', {});
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
    return this.http.get<any>(this.apiBaseUrl + 'api/user/spotifyRefreshToken');
  }

  updateSpotifyRefreshToken(token : string){
     return this.http.post<any>(
       this.apiBaseUrl + 'api/user/spotifyRefreshToken',
       {
        token: token
       }
     );
  }
}
          
