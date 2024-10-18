import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { SpotifyWebPlayerComponent } from '../spotify-components/spotify-web-player/spotify-web-player.component';
import { SourceType } from '../../models/music.model';
import { CommonModule } from '@angular/common';
import { AppleMusicWebPlayerComponent } from '../apple-music-components/apple-music-web-player/apple-music-web-player.component';
import { AppleMusicService } from '../../services/external-services/apple-music.service';
import { SpotifySdkService } from '../../services/external-services/spotify-sdk.service';

@Component({
  selector: 'music-player',
  standalone: true,
  imports: [
    SpotifyWebPlayerComponent,
    CommonModule,
    AppleMusicWebPlayerComponent,
  ],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
  schemas: [],
})
export class MusicPlayerComponent implements OnInit {
  activeService: SourceType = SourceType.NONE;

  constructor(
    private appleMusicService: AppleMusicService,
    private spotifySdkService: SpotifySdkService
  ) {}

  ngOnInit(): void {
    this.appleMusicService.newSongPlaying$.subscribe(() => {
      if (this.spotifySdkService.isSdkInitialized()) {
        this.spotifySdkService.stopPlayer();
      }

      this.activeService = SourceType.APPLE_MUSIC;
    });

    this.spotifySdkService.newSongPlaying$.subscribe(() => {
      if (this.appleMusicService.isMusicKitInitialized()) {
        this.appleMusicService.stopPlayer();
      }

      this.activeService = SourceType.SPOTIFY;
    });
  }

  get SourceType() {
    return SourceType;
  }
}
