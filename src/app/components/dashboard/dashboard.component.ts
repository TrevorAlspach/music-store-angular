import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private spotifyService: SpotifyService){}

  authorizeSpotify(){
    this.spotifyService.getAuthorizationCode()
  }

}
