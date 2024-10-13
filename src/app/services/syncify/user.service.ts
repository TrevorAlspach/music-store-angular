import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectedService, User } from '../../models/user.model';
import { BehaviorSubject, ReplaySubject, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenResponse } from '../../models/spotify-api.model';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiBaseUrl = environment.apiBaseUrl;

  loggedInUser$: ReplaySubject<User> = new ReplaySubject(1);

  //auth0User$: ReplaySubject<import("@auth0/auth0-spa-js").User> = new ReplaySubject(1);
  auth0User!: import('@auth0/auth0-spa-js').User;

  constructor(private http: HttpClient, private auth0Service: Auth0Service) {
    /*     this.getOrCreateUser().subscribe({
      next: (user) => {
        this.loggedInUser$.next(user);
      },
    }); */

    this.getOrCreateUser()
      .pipe(
        switchMap((user) => {
          this.loggedInUser$.next(user);
          return this.auth0Service.user$;
        })
      )
      .subscribe({
        next: (auth0User) => {
          //console.log(auth0User);
          //console.log('auth0user')
        },
      });
  }

  private getUserDetails() {
    return this.http.get<any>(
      'https://' + environment.auth0.domain + '/userinfo'
    );
  }

  private getOrCreateUser() {
    return this.http.get<User>(this.apiBaseUrl + 'user/createOrFindUser');
  }

  //delete current logged in user.
  deleteCurrentUser() {
    return this.http.delete<User>(this.apiBaseUrl + `user/deleteUser`);
  }
}
