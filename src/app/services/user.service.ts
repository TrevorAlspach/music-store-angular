import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectedService, User } from '../models/user.model';
import { shareReplay } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TokenResponse } from '../models/spotify-api.model';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth0Service: Auth0Service) {}

  getOrCreateUser() {
    return this.http.get<User>(this.apiBaseUrl + 'api/user/createOrFindUser');
  }

  deleteUser(id: number) {
    return this.http.delete<User>(this.apiBaseUrl + `api/user/${id}`);
  }
}
