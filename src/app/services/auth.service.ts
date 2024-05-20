import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { shareReplay } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiBaseUrl: string = 'http://localhost:8080/';;

  constructor(
    private http: HttpClient
  ) //private appConfigService: AppConfigService
  {
    //this.apiBaseUrl = this.appConfigService.apiBaseUrl;
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

  signupUser(email: string, password: string, username: string){
    return this.http.post<User>(this.apiBaseUrl + 'auth/signup', {email, password, username, roles:"USER"});
  }
}
          
