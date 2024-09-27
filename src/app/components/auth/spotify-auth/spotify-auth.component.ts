import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SpotifySdkService } from '../../../services/spotify-sdk.service';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'app-spotify-auth',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spotify-auth.component.html',
  styleUrl: './spotify-auth.component.scss',
})
export class SpotifyAuthComponent implements OnInit {
  //spotifyAuth$
  //successfulAuth = false;

  constructor(
    private spotifyService: SpotifyService,
    private spotifySdkService: SpotifySdkService,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe({
      next: (queryParams) => {
        const authCode = queryParams.get('code');
        if (authCode !== null) {
          this.spotifySdkService.handleAuthCode(authCode).subscribe({
            next: (response) => {
              this.spotifySdkService.createSdkFromAccessToken(response);
              //this.spotifySdkService.
              this.router.navigate(['dashboard']);
              this.dashboardService.dashboardRefreshSubject$.next(true);
            },
            error: (e: HttpErrorResponse) => {
              //handle error
            },
          });
        } else {
          //handle error
        }
      },
    });
  }
}
