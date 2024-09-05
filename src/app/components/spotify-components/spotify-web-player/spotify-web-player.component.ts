import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptService } from '../../../scripts/script.service';
import { CustomWindow, WindowRefService } from '../../../services/window-ref.service';
import { exhaustMap, filter, Observable, of, retry, Subject, switchMap, tap, throwError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SpotifySdkService } from '../../../services/spotify-sdk.service';
import { AccessToken, PlaybackState, Track, TrackItem } from '@spotify/web-api-ts-sdk';
import { SpotifyService } from '../../../services/spotify.service';
import { MatSliderDragEvent, MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MillisecondToTimePipe } from "../../../pipes/millisecond-to-time.pipe";
///  <reference types="@types/spotify-web-playback-sdk"/>

@Component({
  selector: 'app-spotify-web-player',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSliderModule,
    FormsModule,
    MatProgressBarModule,
    MillisecondToTimePipe,
  ],
  templateUrl: './spotify-web-player.component.html',
  styleUrl: './spotify-web-player.component.scss',
})
export class SpotifyWebPlayerComponent implements OnInit, OnDestroy {
  //local web player state
  playerState!: Spotify.PlaybackState;
  //cover album image url
  coverImageUrl: string = '';
  currentTrackItem!: Track;
  currentPlayerItem!: Spotify.Track;
  deviceReady: boolean = false;
  volume: number = 0.5;
  trackDuration: number = 0;
  trackPositionAsDecimal: number = 0;
  trackPosition: number = 0;

  updatePlayerStateInterval!: NodeJS.Timeout;

  constructor(
    private scriptService: ScriptService,
    private windowRef: WindowRefService,
    private spotifySdkService: SpotifySdkService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

/*     this.spotifySdkService.playerReady$
      .pipe(
        filter((ready) => {
          console.log('in filter');
          this.deviceReady = ready;
          return ready;
        }),
          switchMap(()=>
            this.spotifySdkService.getCurrentlyPlayingTrack()),

              retry({
        count: 5,
        delay: 1000
      })
      )
      .subscribe((playbackState) => {
        console.log(playbackState)
        if (playbackState) {
          console.log('player state is here');
          this.updateCurrentTrackDetails(
            playbackState
          );
        }
        console.log('player state is not here');

        this.updatePlayerStateInterval = setInterval(() => {
          this.spotifySdkService.getPlayerState().subscribe({
            next: (playbackState) => {
              if (playbackState) {
                this.spotifySdkService.playerState$.next(playbackState);
              }
            },
          });
        }, 1000);
      }); */

    this.spotifySdkService.playerReady$.subscribe((ready)=>{
      this.deviceReady = ready;
      this.updatePlayerStateInterval = setInterval(() => {
        this.spotifySdkService.getPlayerState().subscribe({
          next: (playbackState) => {
            if (playbackState) {
              this.spotifySdkService.playerState$.next(playbackState);
            }
          },
        });
      }, 1000);
    })


    this.spotifySdkService.playerState$.subscribe({
      next: (playerState: Spotify.PlaybackState) => {
        this.currentPlayerItem = playerState.track_window.current_track;
        this.playerState = playerState;
        this.trackDuration = playerState.duration;
        this.trackPosition = playerState.position;
        this.trackPositionAsDecimal =
          (playerState.position / playerState.duration) * 100;
          this.updateCurrentTrackDetailsFromPlayer(
            playerState.track_window.current_track
          );
      },
    });

    
  }

  ngOnDestroy(): void {
    clearInterval(this.updatePlayerStateInterval)
  }

  onVolumeChange() {
    this.spotifySdkService.adjustPlayerVolume(this.volume);
  }

  nextTrack() {
      this.spotifySdkService
        .nextTrack()
        .subscribe(()=>{
          this.updateCurrentTrackDetailsFromPlayer(
            this.playerState.track_window.next_tracks[0]
          );
        });
  }

  prevTrack() {
         this.spotifySdkService.prevTrack().subscribe(() => {
           this.updateCurrentTrackDetailsFromPlayer(
             this.playerState.track_window.previous_tracks[1]
           );
         });
  }

  togglePlay() {
/*     const webPlayerDeviceId = this.spotifySdkService.getWebPlayerDeviceId();
    this.spotifySdkService
      .getPlaybackState()
      .pipe(
        switchMap((playbackState) => {
          if (!playbackState) {
            return this.spotifySdkService
              .transferPlayback(webPlayerDeviceId)
              .pipe(
                switchMap(() => this.spotifySdkService.getPlaybackState())
              );
          } else if (playbackState.device.id !== webPlayerDeviceId) {
            return this.spotifySdkService.transferPlayback(webPlayerDeviceId);
          } else {
            return of(playbackState);
          }
        }),
        switchMap((playback) => {
          return this.spotifySdkService.getPlayerState();
        })
      ) */
     this.spotifySdkService.preparePlayer()
      .subscribe({
        next: (playbackState: Spotify.PlaybackState | null) => {
          if (playbackState) {
            this.currentPlayerItem = playbackState.track_window.current_track;
            this.updateCurrentTrackDetailsFromPlayer(playbackState.track_window.current_track)
          }

          this.spotifySdkService.togglePlayer();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  updateCurrentTrackDetails(playbackState: PlaybackState) {
    const track = playbackState.item as Track;
    if (track.album) {
      console.log(this.currentTrackItem);
      this.currentTrackItem = track;
      console.log(this.currentTrackItem);
      console.log('this is an music track');
      //this.coverImageUrl = track.album.images[0].url;
      if (track.album.images && track.album.images.length > 0) {
        this.coverImageUrl = track.album.images[0].url;
      } else {
        this.coverImageUrl = '';
      }
    } else {
      this.coverImageUrl = '';
    }
  }

  updateCurrentTrackDetailsFromPlayer(track: Spotify.Track) {
    if (track.album) {
      if (track.album.images && track.album.images.length > 0) {
        this.coverImageUrl = track.album.images[0].url;
      } else {
        this.coverImageUrl = '';
      }
    } else {
      this.coverImageUrl = '';
    }
  }

  async loadSpotifyWebPlayerScript() {
    let data = await this.scriptService
      .load('spotifyWebPlayer')
      .catch((error) => console.log(error));
    console.log('script loaded ', data);
  }
}
