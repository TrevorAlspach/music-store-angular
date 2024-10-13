import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'apple-music-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './apple-music-profile.component.html',
  styleUrl: './apple-music-profile.component.scss',
})
export class AppleMusicProfileComponent {
  /*  appleMusicUser!: AppleMusicUser; */
  profileImageUrl!: string;
  isLoading = true;
  notAuthorized = false;

  constructor(
    private spotifyService: SpotifyService,
    private changeDetectorRef: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    /*     this.spotifyService.getUserProfile().subscribe({
      next: (res: SpotifyUser) => {
        this.spotifyUser = res;

        //let imageUrl: string;
        if (this.spotifyUser.images && this.spotifyUser.images.length > 0) {
          this.profileImageUrl = this.spotifyUser.images[0].url;
        } else {
          this.profileImageUrl = '';
        }

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.isLoading = false;
        this.notAuthorized = true;
      },
    }); */
  }

  connectAppleMusicAccount() {
    this.spotifyService.getAuthorizationCode();
  }

  disconnectAppleMusicAccount() {
    /*     this.spotifyService.disconnectAccount();
    this.appleMusicUser = this.spotifyService.getAuthenticatedUser();
    this.dashboardService.dashboardRefreshSubject$.next(true);
    this.notAuthorized = true; */
  }

  /*   navigateToAppleMusicAccount() {
    window.open(this.appleMusicUser.external_urls.spotify);
  } */
}
