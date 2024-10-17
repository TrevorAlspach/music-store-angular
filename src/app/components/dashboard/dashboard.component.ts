import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/external-services/spotify.service';
import { AuthService } from '../../services/syncify/auth.service';
import { SpotifyProfileComponent } from '../spotify-components/spotify-profile/spotify-profile.component';
/* import { PlaylistsComponent } from '../playlists/playlists.component'; */
import { HttpClient } from '@angular/common/http';
import { SpotifyWebPlayerComponent } from '../spotify-components/spotify-web-player/spotify-web-player.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ServicesComponent } from '../services/services.component';
import { exhaustMap, merge, mergeMap, of, switchMap, throwError } from 'rxjs';
import { ConnectedService } from '../../models/user.model';
import { SourceType } from '../../models/music.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/syncify/user.service';
import { DashboardService } from './dashboard.service';
import { SpotifySdkService } from '../../services/external-services/spotify-sdk.service';
/* import { PlaylistsV2Component } from '../playlists/playlists-v2/playlists-v2.component'; */
import { AppleMusicService } from '../../services/external-services/apple-music.service';
import { PlaylistsComponent } from '../playlists/playlists.component';
import { TokenResponse } from '../../models/spotify-api.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SpotifyProfileComponent,
    PlaylistsComponent,
    SpotifyWebPlayerComponent,
    MatGridListModule,
    ServicesComponent,
    /* PlaylistsV2Component, */
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private userService: UserService,
    private spotifySdkService: SpotifySdkService,
    private appleMusicService: AppleMusicService
  ) {}

  connectedServices: ConnectedService[] = [
    {
      externalService: SourceType.SYNCIFY,
      imgPath: 'assets/syncify.png',
      expired: false,
      displayName: 'Syncify',
    },
  ];

  ngOnInit(): void {
    this.userService.loggedInUser$
      .pipe(switchMap(() => this.authService.connectedServices()))
      .subscribe({
        next: (connectedServices: ConnectedService[]) => {
          for (let service of connectedServices) {
            this.connectedServices.push(service);
            this.initSdkForService(service.externalService);
          }
        },
        error: () => {},
      });
  }

  initSdkForService(sourceType: SourceType /* expired: boolean */) {
    if (sourceType === SourceType.SPOTIFY) {
      this.spotifySdkService.initializeSdk();
    }

    if (sourceType === SourceType.APPLE_MUSIC) {
      this.appleMusicService.musicKitInit$
        .pipe(
          switchMap(() => {
            console.log('in the int of am service');
            if (this.appleMusicService.alreadyAuthorized() /* && !expired */) {
              console.log('User is already authorized with Apple Music');
              return of(
                this.appleMusicService.getMusicKitInstance().musicUserToken
              );
              // Return the existing token
            } else {
              return this.authService.getAppleMusicUserToken().pipe(
                switchMap((tokenResponse: TokenResponse) => {
                  if (tokenResponse.token) {
                    this.appleMusicService.setUserToken(tokenResponse.token);
                    return of(tokenResponse.token);
                  } else {
                    return throwError(() => 'User will need to reauthorize');
                  }
                })
              );
            }
          })
        )
        .subscribe({
          next: (token) => {
            this.appleMusicService.userTokenInit$.next(true);
          },
          error: (e) => {
            console.log(e);
          },
        });
      this.appleMusicService.init();
    }
  }

  clearTokens() {
    localStorage.removeItem('spotify_access_token');
  }
}
