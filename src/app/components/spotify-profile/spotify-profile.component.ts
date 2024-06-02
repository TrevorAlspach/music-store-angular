import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SpotifyService } from '../../services/spotify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpotifyUser } from '../../models/spotify-api.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'spotify-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './spotify-profile.component.html',
  styleUrl: './spotify-profile.component.scss'
})
export class SpotifyProfileComponent implements OnInit{

  spotifyUser!: SpotifyUser;
  isLoading = true;
  notAuthorized = false;

  constructor(private spotifyService: SpotifyService){}

  ngOnInit(){
    this.spotifyService.getUserProfile().subscribe({
      next: (res: SpotifyUser)=>{
        this.spotifyUser = res;
        console.log(res);
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse)=>{
        console.log(err);
        this.isLoading = false;
        this.notAuthorized = true;
      }
    })
  }

  connectSpotifyAccount(){
    this.spotifyService.getAuthorizationCode();
  }

}
