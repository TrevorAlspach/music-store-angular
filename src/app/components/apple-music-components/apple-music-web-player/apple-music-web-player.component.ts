import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MillisecondToTimePipe } from '../../../pipes/millisecond-to-time.pipe';
import { MatButtonModule } from '@angular/material/button';
import { AppleMusicService } from '../../../services/external-services/apple-music.service';
import { defer, switchMap } from 'rxjs';

@Component({
  selector: 'apple-music-web-player',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    MatProgressBarModule,
    MillisecondToTimePipe,
  ],
  templateUrl: './apple-music-web-player.component.html',
  styleUrl: './apple-music-web-player.component.scss',
})
export class AppleMusicWebPlayerComponent implements OnInit {
  paused: boolean = true;
  //cover album image url
  coverImageUrl: string = '';
  //currentTrackItem!: Track;
  currentPlayerItem!: any;
  deviceReady: boolean = false;
  volume: number = 0.5;
  trackDuration: number = 0;
  trackPositionAsDecimal: number = 0;
  trackPosition: number = 0;

  musicKit: any;
  updatePlayerStateInterval!: NodeJS.Timeout;

  constructor(private appleMusicService: AppleMusicService) {}

  ngOnInit() {
    this.musicKit = this.appleMusicService.getMusicKitInstance();

    this.updatePlayerStateInterval = setInterval(() => {
      this.trackPosition =
        this.appleMusicService.getTrackPositionOfPlayingSong() * 1000;

      this.trackDuration =
        this.appleMusicService.getTrackDurationOfPlayingSong() * 1000;
      this.trackPositionAsDecimal =
        (this.trackPosition / this.trackDuration) * 100;
    }, 1000);

    this.appleMusicService.newSongPlaying$
      .pipe(switchMap(() => this.appleMusicService.playTackAtQueueStart()))
      .subscribe(() => {
        console.log('in the subscribe');
        this.deviceReady = true;

        this.paused = false;
        this.currentPlayerItem = {
          name: this.musicKit.nowPlayingItem.attributes.name,
          artist: this.musicKit.nowPlayingItem.attributes.artistName,
          imageUrl: this.appleMusicService.formatImageUrl(
            this.musicKit.nowPlayingItem.attributes.artwork.url,
            50,
            50
          ),
        };
      });
  }

  prevTrack() {
    this.musicKit.skipToPreviousItem();
  }

  togglePlay() {
    if (this.musicKit.isPlaying) {
      this.musicKit.pause().then(() => {
        this.paused = !this.paused;
        if (this.musicKit.nowPlayingItem) {
          this.currentPlayerItem = {
            name: this.musicKit.nowPlayingItem.attributes.name,
            artist: this.musicKit.nowPlayingItem.attributes.artistName,
            imageUrl: this.appleMusicService.formatImageUrl(
              this.musicKit.nowPlayingItem.attributes.artwork.url,
              50,
              50
            ),
          };
        }
      });
    } else {
      this.musicKit.play().then(async () => {
        this.paused = !this.paused;
        if (this.musicKit.nowPlayingItem) {
          this.currentPlayerItem = {
            name: this.musicKit.nowPlayingItem.attributes.name,
            artist: this.musicKit.nowPlayingItem.attributes.artistName,
            imageUrl: this.appleMusicService.formatImageUrl(
              this.musicKit.nowPlayingItem.attributes.artwork.url,
              50,
              50
            ),
          };
        }
      });
    }
  }

  nextTrack() {
    this.musicKit.skipToNextItem().then(
      () => {
        if (!this.musicKit.nowPlayingItem) {
          this.paused = true;
        }
      },
      (e: any) => {
        console.log(e);
      }
    );
  }

  onVolumeChange() {
    this.musicKit.volume = this.volume;
  }
}
