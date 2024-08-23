import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../../scripts/script.service';
import { CustomWindow, WindowRefService } from '../../../services/window-ref.service';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
///  <reference types="@types/spotify-web-playback-sdk"/>

@Component({
  selector: 'app-spotify-web-player',
  standalone: true,
  imports: [MatButtonModule],
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
      console.log(this.getSpotifyAccessToken() + " token!!")
      const token = this.getSpotifyAccessToken();
      this.player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });
      //this.spotifySdkPlayerReady$.next('player_ready');

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
    };
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
  }
}

/* interface CustomWindow extends Window {
  onSpotifyWebPlaybackSDKReady: any;
} */
