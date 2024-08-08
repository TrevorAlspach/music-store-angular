import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  //successfulAuth = false;

  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe({
      next: (queryParams)=>{
        const authCode = queryParams.get("code");
        if (authCode !== null){
          this.spotifyService.getAccessToken(authCode).subscribe({
            next: (response)=>{
              console.log('got access token using auth code');
              //this.successfulAuth = true;
              this.router.navigate(['dashboard'])
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
