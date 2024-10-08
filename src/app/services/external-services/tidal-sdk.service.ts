import { Injectable } from '@angular/core';
import { createUserClient } from '@tidal-music/user';
import {
  init,
  initializeLogin,
  finalizeLogin,
  credentialsProvider,
} from '@tidal-music/auth';
import { defer, switchMap } from 'rxjs';
import { AuthService } from '../syncify/auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TidalSdkService {
  constructor(private authService: AuthService) {}

  private getCurrentUser(id: string) {
    const userClient = createUserClient(credentialsProvider);
    return defer(() =>
      userClient.GET(
        '/users/me' /* , {
        params: {
          path: { id },
          query: {
            locale: 'en-US',
          },
        },
      } */
      )
    );
  }

  public authorizeUser() {
    this.initSdk()
      .pipe(switchMap(() => this.tidalLogin()))
      .subscribe({
        next: (loginUrl) => {
          window.open(loginUrl, '_self');
        },
      });
  }

  public finalizeLogin(queryString: string) {
    return defer(() => finalizeLogin(queryString));
  }

  private tidalLogin() {
    return defer(() =>
      initializeLogin({
        redirectUri: environment.tidal.redirectUri,
      })
    );
  }

  private initSdk() {
    return defer(() =>
      init({
        clientId: environment.tidal.clientId,
        credentialsStorageKey: environment.tidal.credentialsStorageKey,
      })
    );
  }
}
