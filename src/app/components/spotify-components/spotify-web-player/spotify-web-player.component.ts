import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../../scripts/script.service';
import { CustomWindow, WindowRefService } from '../../../services/window-ref.service';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SpotifySdkService } from '../../../services/spotify-sdk.service';
import { AccessToken } from '@spotify/web-api-ts-sdk';
///  <reference types="@types/spotify-web-playback-sdk"/>

@Component({
  selector: 'app-spotify-web-player',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './spotify-web-player.component.html',
  styleUrl: './spotify-web-player.component.scss',
})
export class SpotifyWebPlayerComponent implements OnInit {
  private window: CustomWindow;
  private player!: Spotify.Player;

  private spotifySdkPlayerReady$ = new Subject();

  constructor(private scriptService: ScriptService, private windowRef: WindowRefService) {
    //Manually load the spotify web player sdk script. They need a npm package for this :/
    this.loadSpotifyWebPlayerScript();

    this.window = windowRef.nativeWindow;

    this.window.onSpotifyWebPlaybackSDKReady = () => {
          const token = this.getSpotifyAccessToken();
          console.log('TOKEN!!!')
          this.player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: (cb) => {
              cb(token);
            },
            volume: 0.5,
          });

          this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
          });

          // Not Ready
          this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });

          this.player.addListener(
            'initialization_error',
            ({ message }) => {
              console.error(message);
            }
          );

          this.player.addListener(
            'authentication_error',
            ({ message }) => {
              console.error(message);
            }
          );

          this.player.addListener('account_error', ({ message }) => {
            console.error(message);
          });

          this.player.connect();
        }
    
    }

  ngOnInit(): void {
    this.spotifySdkPlayerReady$.subscribe(()=>{
    })
  }

  togglePlay(){
    this.player.togglePlay();
    //this.player.
  }

  async loadSpotifyWebPlayerScript() {
    let data = await this.scriptService
      .load('spotifyWebPlayer')
      .catch((error) => console.log(error));
      console.log('script loaded ', data);
  }

  getSpotifyAccessToken() {
    return localStorage.getItem('spotify_access_token') as string;
    //return this.spotifySdkService.getAccessToken();
  }
}

/* interface CustomWindow extends Window {
  onSpotifyWebPlaybackSDKReady: any;
} */
