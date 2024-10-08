import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpotifyUser } from '../../../models/spotify-api.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from '../../dashboard/dashboard.service';
import { SpotifySdkService } from '../../../services/external-services/spotify-sdk.service';
import { UserProfile } from '@spotify/web-api-ts-sdk';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'spotify-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './spotify-profile.component.html',
  styleUrl: './spotify-profile.component.scss',
})
export class SpotifyProfileComponent implements OnInit {
  spotifyUser!: SpotifyUser;
  profileImageUrl!: string;
  isLoading = true;
  notAuthorized = false;

  constructor(
    private spotifyService: SpotifyService,
    private changeDetectorRef: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private spotifySdkService: SpotifySdkService
  ) {}

  ngOnInit() {
    this.spotifySdkService.sdkReady$
      .pipe(
        switchMap((ready) => {
          if (ready === true) {
            return this.spotifySdkService.getUserProfile();
          } else {
            return throwError(() => {
              console.log('sdk not init yet');
              this.isLoading = false;
              this.notAuthorized = true;
            });
          }
        })
      )
      .subscribe({
        next: (res: UserProfile) => {
          this.spotifyUser = res;

          //let imageUrl: string;
          if (this.spotifyUser.images && this.spotifyUser.images.length > 0) {
            this.profileImageUrl = this.spotifyUser.images[0].url;
          } else {
            this.profileImageUrl = '';
          }

          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
          this.notAuthorized = true;
        },
      });
  }

  connectSpotifyAccount() {
    //this.spotifyService.getAuthorizationCode();
    this.spotifySdkService.authenticate();
  }

  disconnectSpotifyAccount() {
    this.spotifyService.disconnectAccount();
    this.spotifyUser = this.spotifyService.getAuthenticatedUser();
    this.dashboardService.dashboardRefreshSubject$.next(true);
    this.notAuthorized = true;
  }

  navigateToSpotifyAccount() {
    window.open(this.spotifyUser.external_urls.spotify);
  }
}
