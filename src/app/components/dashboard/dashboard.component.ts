import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { SpotifyProfileComponent } from '../spotify-components/spotify-profile/spotify-profile.component';
import { PlaylistsComponent } from '../playlists/playlists.component';
import { HttpClient } from '@angular/common/http';
import { AppleMusicProfileComponent } from '../apple-music-profile/apple-music-profile.component';
import { SpotifyWebPlayerComponent } from '../spotify-components/spotify-web-player/spotify-web-player.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ServicesComponent } from '../services/services.component';
import { switchMap } from 'rxjs';
import { ConnectedService } from '../../models/user.model';
import { SourceType } from '../../models/music.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SpotifyProfileComponent,
    PlaylistsComponent,
    AppleMusicProfileComponent,
    SpotifyWebPlayerComponent,
    MatGridListModule,
    ServicesComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  connectedServices: ConnectedService[] = [
    { externalService: SourceType.SYNCIFY, imgPath: 'assets/guitar_icon.jpg' },
  ];

  ngOnInit(): void {
    /*  this.userService.getOrCreateUser().subscribe({
      next: () => {
        console.log('got user info from token');
      },
    }); */

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

  clearTokens() {
    localStorage.removeItem('spotify_access_token');
  }
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
