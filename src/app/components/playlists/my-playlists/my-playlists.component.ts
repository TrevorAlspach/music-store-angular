import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PlaylistLargeComponent } from '../playlist-large/playlist-large.component';
import { PlaylistsComponent } from '../playlists.component';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { ConnectedService } from '../../../models/user.model';
import { PlaylistsService } from '../../../services/playlists.service';
import { SpotifySdkService } from '../../../services/spotify-sdk.service';
import { SpotifyService } from '../../../services/spotify.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { PlaylistEventService } from '../playlist-event.service';
import { AuthService } from '../../../services/auth.service';
import { SourceType } from '../../../models/music.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-my-playlists',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    PlaylistLargeComponent,
    MatIconModule,
    SlickCarouselModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PlaylistsComponent,
  ],
  templateUrl: './my-playlists.component.html',
  styleUrl: './my-playlists.component.scss',
})
export class MyPlaylistsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  connectedServices: ConnectedService[] = [
    { externalService: SourceType.SYNCIFY, imgPath: 'assets/guitar_icon.jpg' },
  ];

  ngOnInit(): void {
    this.userService
      .getOrCreateUser()
      .pipe(switchMap(() => this.authService.connectedServices()))
      .subscribe({
        next: (connectedServices: ConnectedService[]) => {
          for (let service of connectedServices) {
            this.connectedServices.push(service);
          }
        },
        error: () => {},
      });
  }
}
