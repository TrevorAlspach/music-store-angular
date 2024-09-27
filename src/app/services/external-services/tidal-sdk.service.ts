import { Injectable } from '@angular/core';
import { init, initializeLogin } from '@tidal-music/auth';
import { defer, switchMap } from 'rxjs';
import { AuthService } from '../syncify/auth.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TidalSdkService {
  constructor(private authService: AuthService) {}

  public authorizeUser() {
    this.initSdk()
      .pipe(switchMap(() => this.tidalLogin()))
      .subscribe({
        next: (loginUrl) => {
          window.open(loginUrl, '_self');
        },
      });
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
