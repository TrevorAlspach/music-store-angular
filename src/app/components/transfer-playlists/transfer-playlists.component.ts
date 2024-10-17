import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlaylistSelectorComponent } from './playlist-selector/playlist-selector.component';
import { SourceSelectorComponent } from './source-selector/source-selector.component';
import {
  Playlist,
  PlaylistDetails,
  Song,
  SourceType,
  TransferSide,
} from '../../models/music.model';
import { SongSelectorComponent } from './song-selector/song-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TransferPlaylistsService } from './transfer-playlists.service';
import {
  defer,
  expand,
  from,
  map,
  merge,
  Observable,
  reduce,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/external-services/spotify.service';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpotifyTrackWrapper } from '../../models/spotify-api.model';
import { PlaylistsService } from '../../services/syncify/playlists.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlaylistDetailsComponent } from '../playlists/playlist-details/playlist-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppleMusicService } from '../../services/external-services/apple-music.service';
import { AMTrack } from '../../models/apple-music.model';

@Component({
  selector: 'app-transfer-playlists',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    SourceSelectorComponent,
    PlaylistSelectorComponent,
    SongSelectorComponent,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    PlaylistDetailsComponent,
    MatTooltipModule,
  ],
  templateUrl: './transfer-playlists.component.html',
  styleUrl: './transfer-playlists.component.scss',
})
export class TransferPlaylistsComponent implements OnInit, OnDestroy {
  sourceAndDestinationReady = false;
  transferReady = false;
  transferComplete = false;
  total: number = 0;
  i: number = 0;

  combinedSubject$!: Observable<SourceType | Playlist | null>;
  selectedPlaylist!: Playlist;
  selectedDestination!: SourceType;

  createDestinationPlaylistFormGroup: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(0), Validators.maxLength(20)],
    ],
    description: [''],
  });

  syncifyPlaylistToTransferToSpotify$ = new Subject<Playlist>();
  spotifyPlaylistToTransferToMusicStore$ = new Subject<Playlist>();

  combinedSubjectSubscription!: Subscription;
  selectedPlaylistSubscription!: Subscription;
  selectedDestinationSubscription!: Subscription;

  constructor(
    private matDialog: MatDialog,
    private transferPlaylistsService: TransferPlaylistsService,
    private spotifyService: SpotifyService,
    private fb: FormBuilder,
    private playlistsService: PlaylistsService,
    private appleMusicService: AppleMusicService
  ) {}

  ngOnInit(): void {
    this.appleMusicService.createPlaylist('', '', []);

    this.combinedSubject$ = merge(
      this.transferPlaylistsService.selectedSource$,
      this.transferPlaylistsService.selectedDestination$,
      this.transferPlaylistsService.selectedSourcePlaylist$
    );

    this.combinedSubjectSubscription = this.combinedSubject$.subscribe({
      next: (subjectChanged) => {
        if (
          this.transferPlaylistsService.selectedSource$.value !==
            SourceType.NONE &&
          this.transferPlaylistsService.selectedDestination$.value !==
            SourceType.NONE &&
          this.transferPlaylistsService.selectedSourcePlaylist$.value !== null
        ) {
          this.transferReady = true;
        } else {
          this.transferReady = false;
        }

        if (
          this.transferPlaylistsService.selectedSource$.value !==
            SourceType.NONE &&
          this.transferPlaylistsService.selectedDestination$.value !==
            SourceType.NONE
        ) {
          this.sourceAndDestinationReady = true;
        } else {
          this.sourceAndDestinationReady = false;
        }
      },
    });

    this.selectedPlaylistSubscription =
      this.transferPlaylistsService.selectedSourcePlaylist$.subscribe({
        next: (selectedPlaylist) => {
          if (selectedPlaylist !== null) {
            this.selectedPlaylist = selectedPlaylist;
          }
        },
      });

    this.selectedDestinationSubscription =
      this.transferPlaylistsService.selectedDestination$.subscribe(
        (selectedDestination) => {
          if (selectedDestination) {
            this.selectedDestination = selectedDestination;
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.combinedSubjectSubscription.unsubscribe();
    this.selectedPlaylistSubscription.unsubscribe();

    this.transferPlaylistsService.selectedSource$.next(SourceType.NONE);
    this.transferPlaylistsService.selectedDestination$.next(SourceType.NONE);
    this.transferPlaylistsService.selectedSourcePlaylist$.next(null);
  }

  initiateTransfer() {
    this.transferComplete = false;
    const destination =
      this.transferPlaylistsService.selectedDestination$.value;
    const source = this.transferPlaylistsService.selectedSource$.value;

    const playlistToTransfer = this.transferPlaylistsService
      .selectedSourcePlaylist$.value as Playlist;

    if (destination === SourceType.SYNCIFY && source === SourceType.SPOTIFY) {
      this.transferFromSpotifyToSyncify(playlistToTransfer).subscribe({
        next: (res) => {
          this.transferComplete = true;
        },
      });
    } else if (
      destination === SourceType.SPOTIFY &&
      source === SourceType.SYNCIFY
    ) {
      this.transferFromSyncifyToSpotify(playlistToTransfer).subscribe({
        next: (res) => {
          this.transferComplete = true;
        },
      });
    } else if (
      destination === SourceType.SYNCIFY &&
      source === SourceType.APPLE_MUSIC
    ) {
      this.transferFromAppleMusicToSyncify(playlistToTransfer).subscribe(
        (res) => {
          this.transferComplete = true;
        }
      );
    } else if (
      destination === SourceType.APPLE_MUSIC &&
      source === SourceType.SYNCIFY
    ) {
      this.transferFromSyncifyToAppleMusic(playlistToTransfer).subscribe(
        (res) => {
          this.transferComplete = true;
        }
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

  get TransferSide() {
    return TransferSide;
  }

  get SourceType() {
    return SourceType;
  }

  private transferFromSpotifyToSyncify(playlist: Playlist) {
    return this.getAllSongsOfSpotifyPlaylist(playlist.id as string)
      .pipe(
        map((allSongs: SpotifyTrackWrapper[]) => {
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
            imageUrl: '',
            name: this.createDestinationPlaylistFormGroup.get('name')?.value,
            description:
              this.createDestinationPlaylistFormGroup.get('description')?.value,
          };
          return this.transferPlaylistsService.transferSongsToMusicStore(
            newPlaylist
          );
        })
      );
  }

  private transferFromSyncifyToSpotify(playlist: Playlist) {
    return this.playlistsService
      .getPlaylist(playlist.id as string)
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
      );
  }

  private transferFromAppleMusicToSyncify(playlist: Playlist) {
    return this.appleMusicService
      .getAllSongsOfPlaylist(playlist.id)
      .pipe(
        map((allSongs: AMTrack[]) => {
          return allSongs.map((song: AMTrack) => {
            return <Song>{
              name: song.attributes.name,
              album: song.attributes.albumName,
              artist: song.attributes.artistName,
              time: this.millisToMinutesAndSeconds(
                song.attributes.durationInMillis
              ),
              imageUrl: '/assets/defaultAlbum.jpg',
              releaseYear: this.parseReleaseYearFromSpotifyDateString(
                song.attributes.releaseDate
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
            imageUrl: '',
            name: this.createDestinationPlaylistFormGroup.get('name')?.value,
            description:
              this.createDestinationPlaylistFormGroup.get('description')?.value,
          };
          return this.transferPlaylistsService.transferSongsToMusicStore(
            newPlaylist
          );
        })
      );
  }

  transferFromSyncifyToAppleMusic(playlist: Playlist) {
    return this.playlistsService
      .getPlaylist(playlist.id as string)
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
          return this.appleMusicService.createPlaylist(
            this.createDestinationPlaylistFormGroup.get('name')?.value,
            this.createDestinationPlaylistFormGroup.get('description')?.value,
            allSongs
          );
        })
      );
  }
}
