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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.getOrCreateUser().subscribe({
      next: () => {
        console.log('got user info from token');
      },
    });
  }

  clearTokens() {
    localStorage.removeItem('spotify_access_token');
  }

  /*   getSpotifyRefreshToken(){
    this.authService.getSpotifyRefreshToken().subscribe({
      next: (res)=>{
        console.log(res)
      }
    })
  } */
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
