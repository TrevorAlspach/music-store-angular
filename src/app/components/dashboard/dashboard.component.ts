import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { SpotifyProfileComponent } from '../spotify-profile/spotify-profile.component';
import { PlaylistsComponent } from '../playlists/playlists.component';
import { HttpClient } from '@angular/common/http';
import { DiscogsService } from '../../services/discogs.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, SpotifyProfileComponent, PlaylistsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private spotifyService: SpotifyService, private authService: AuthService, private http: HttpClient, private dicogsService: DiscogsService){}

  /* getSpotifyProfile(){
    //this.spotifyService.getAuthorizationCode()
    this.spotifyService.getUserProfile().subscribe({
      next: (res)=>{
        console.log(res)
      }
    })
  } */

  clearTokens(){
    localStorage.removeItem('spotify_access_token');
  }

  getSpotifyRefreshToken(){
    this.authService.getSpotifyRefreshToken().subscribe({
      next: (res)=>{
        console.log(res)
      }
    })
  }


  hitUserApi(){
    /* this.dicogsService.searchTracks('yesterday', 'the beatles', "Help!",2009).subscribe({
      next: (res)=>{
        console.log(res)
      }
    }) */

      let list = [];
      list.push(
        this.dicogsService.searchTracks(
          'yesterday',
          'the beatles',
          'Help!',
          2009
        ),
        this.dicogsService.searchTracks(
          'THANK GOD',
          'Travis Scott',
          'Utopia',
          2023
        )
      );

      this.dicogsService.rateLimitRequests(list).subscribe({
        next: (res)=>{
          console.log(res)
        }
      })

  }
}
