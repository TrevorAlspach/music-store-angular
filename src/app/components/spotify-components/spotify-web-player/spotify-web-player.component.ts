import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptService } from '../../../scripts/script.service';
import { CustomWindow, WindowRefService } from '../../../services/window-ref.service';
import { exhaustMap, of, Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SpotifySdkService } from '../../../services/spotify-sdk.service';
import { AccessToken } from '@spotify/web-api-ts-sdk';
import { SpotifyService } from '../../../services/spotify.service';
///  <reference types="@types/spotify-web-playback-sdk"/>

@Component({
  selector: 'app-spotify-web-player',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './spotify-web-player.component.html',
  styleUrl: './spotify-web-player.component.scss',
})
export class SpotifyWebPlayerComponent implements OnInit, OnDestroy {

  constructor(private scriptService: ScriptService, private windowRef: WindowRefService, private spotifySdkService: SpotifySdkService) {
    
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      console.log('on destroy')
  }

  togglePlay(){
    const webPlayerDeviceId = this.spotifySdkService.getWebPlayerDeviceId();
    this.spotifySdkService
      .getPlaybackState()
      .pipe(
        exhaustMap((playbackState) => {
          if (!playbackState || playbackState.device.id !== webPlayerDeviceId) {
            return this.spotifySdkService.transferPlayback(webPlayerDeviceId);
          } else {
            return of(playbackState);
          }
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.spotifySdkService.togglePlayer();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  async loadSpotifyWebPlayerScript() {
    let data = await this.scriptService
      .load('spotifyWebPlayer')
      .catch((error) => console.log(error));
      console.log('script loaded ', data);
  }
}
