import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Playlist, PlaylistDetails, Song, SourceType } from '../../../models/music.model';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, expand, map, Observable, reduce, Subject, Subscription, switchMap, tap } from 'rxjs';
import { SpotifyService } from '../../../services/spotify.service';
import { SpotifyTrack, SpotifyTrackWrapper } from '../../../models/spotify-api.model';
import { PlaylistsService } from '../../../services/playlists.service';


@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.scss',
})
export class TransferDialogComponent implements OnInit {
  total: number;
  i: number = 0;

  transferInitiated = false;

  //private allSongsSubscription!: Subscription;

  createDestinationPlaylistFormGroup: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(0), Validators.maxLength(20)],
    ],
    description: [''],
  });

  playlistToTransferToSpotify$ = new Subject<Playlist>();
  playlistToTransferToMusicStore$ = new Subject<Playlist>();

  MusicStoreTransferPlaylistSubscription: Subscription =
    this.playlistToTransferToMusicStore$
      .pipe(
        switchMap((playlist) =>
          this.getAllSongsOfSpotifyPlaylist(playlist.id as string)
        )
      )
      .pipe(
        map((allSongs: SpotifyTrackWrapper[]) => {
          console.log('in here');
          return allSongs.map((song: SpotifyTrackWrapper) => {
            return <Song>{
              name: song.track.name,
              album: song.track.album.name,
              artist: song.track.artists
                .map((artist) => {
                  return artist.name;
                })
                .join(', '),
              time: this.millisToMinutesAndSeconds(song.track.duration_ms),
              imageUrl: song.track.album.images[0].url,
              releaseYear: this.parseReleaseYearFromSpotifyDateString(
                song.track.album.release_date
              ),
            };
          });
        })
      )
      .pipe(
        tap((songs) => {
          this.total = songs.length;
        })
      )
      .pipe(
        switchMap((allSongs) => {
          const newPlaylist = <PlaylistDetails>{
            songs: allSongs,
            songCount: allSongs.length,
            source: this.transferPlaylistsService.selectedDestination$.value,
            imageUrl:
              'https://www.shareicon.net/data/128x128/2015/10/19/658317_music_512x512.png',
            name: this.createDestinationPlaylistFormGroup.get('name')?.value,
            description:
              this.createDestinationPlaylistFormGroup.get('description')?.value,
          };
          return this.transferPlaylistsService.transferSongsToMusicStore(newPlaylist);
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });

  spotifyTransferPlaylistSubscription: Subscription =
    this.playlistToTransferToSpotify$
      .pipe(
        switchMap((playlist) =>
          this.playlistsService.getPlaylist(playlist.id as string)
        )
      )
      .pipe(
        map((playlist: PlaylistDetails) => {
          return playlist.songs;
        })
      )
      .pipe(
        tap((songs) => {
          this.total = songs.length;
        })
      )
      .pipe(
        switchMap((allSongs) => {
          return this.spotifyService.createPlaylist(
            this.createDestinationPlaylistFormGroup.get('name')?.value,
            this.createDestinationPlaylistFormGroup.get('description')?.value,
            allSongs
          );
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });

  constructor(
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transferPlaylistsService: TransferPlaylistsService,
    private fb: FormBuilder,
    private spotifyService: SpotifyService,
    private playlistsService: PlaylistsService
  ) {
    this.total = data.total;
  }

  ngOnInit() {}

  initiateTransfer() {
    const destination = this.transferPlaylistsService.selectedDestination$.value;

    if (destination === SourceType.MUSIC_STORE){
      this.transferInitiated = true;
      this.playlistToTransferToMusicStore$.next(
        this.transferPlaylistsService.selectedPlaylist$.value as Playlist
      );
    } 

    else if (destination === SourceType.SPOTIFY){
      this.transferInitiated = true;
      this.playlistToTransferToSpotify$.next(
        this.transferPlaylistsService.selectedPlaylist$.value as Playlist
      );
    }

    
  }

  getAllSongsOfSpotifyPlaylist(
    playlistId: string
  ): Observable<SpotifyTrackWrapper[]> {
    const initialOffset = 0;

    return this.spotifyService
      .getSongsOfPlaylist(playlistId, 50, initialOffset)
      .pipe(
        expand((response) =>
          response.next
            ? this.spotifyService.getSongsOfPlaylist(
                playlistId,
                50,
                response.offset + response.limit
              )
            : []
        ),
        reduce(
          (acc: SpotifyTrackWrapper[], response) => acc.concat(response.items),
          []
        )
      );
  }

  millisToMinutesAndSeconds(millis: any) {
    var minutes = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  parseReleaseYearFromSpotifyDateString(releaseDate: string): number {
    return Number.parseInt(releaseDate.slice(0, 3));
  }
}
