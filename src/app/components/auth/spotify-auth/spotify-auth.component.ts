import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spotify-auth',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spotify-auth.component.html',
  styleUrl: './spotify-auth.component.scss',
})
export class SpotifyAuthComponent implements OnInit {
  //spotifyAuth$
  successfulAuth = false;

  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
     /*  this.route.queryParamMap.pipe(
      switchMap((params: ParamMap)=> 
        of(params)
    )
    ).subscribe({
      next: (val)=>{console.log(val)}
    }); */

    this.route.queryParamMap.subscribe({
      next: (queryParams)=>{
        const authCode = queryParams.get("code");
        if (authCode !== null){
          this.spotifyService.getAccessToken(authCode).subscribe({
            next: (response)=>{
              console.log('got access token using auth code');
              //store access token
              //localStorage.setItem("spotify_access_token", response['access_token']);
              //localStorage.setItem('spotify_token_expired_at',(Date.now()/1000) + response['expires_in']);
              this.successfulAuth = true;
            },
            error: (e: HttpErrorResponse) =>{
              //handle error
            }
          })
        } else {
          //handle error
        }
        
        console.log(authCode)
      }
    })
  }
}
