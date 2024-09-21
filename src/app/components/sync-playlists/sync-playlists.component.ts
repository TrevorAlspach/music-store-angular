import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PlaylistSelectorComponent } from '../transfer-playlists/playlist-selector/playlist-selector.component';
import {
  Playlist,
  PlaylistDetails,
  PlaylistSelectedEvent,
  Song,
  SourceType,
  SyncType,
  TransferSide,
} from '../../models/music.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlaylistDetailsComponent } from '../playlists/playlist-details/playlist-details.component';
import { SongSelectorComponent } from '../transfer-playlists/song-selector/song-selector.component';
import { SourceSelectorComponent } from '../transfer-playlists/source-selector/source-selector.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Observable,
  Subject,
  Subscription,
  switchMap,
  map,
  tap,
  merge,
  expand,
  reduce,
} from 'rxjs';
import { SpotifyTrackWrapper } from '../../models/spotify-api.model';
import { PlaylistsService } from '../../services/playlists.service';
import { SpotifyService } from '../../services/spotify.service';
import { TransferPlaylistsService } from '../transfer-playlists/transfer-playlists.service';
import { MatListModule } from '@angular/material/list';
import { SyncPlaylistsService } from '../../sync-playlists.service';

@Component({
  selector: 'app-sync-playlists',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
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
  templateUrl: './sync-playlists.component.html',
  styleUrl: './sync-playlists.component.scss',
})
export class SyncPlaylistsComponent {
  get SourceType() {
    return SourceType;
  }

  sourceAndDestinationReady = false;
  transferReady = false;
  syncComplete = false;
  total: number = 0;
  i: number = 0;

  combinedSubject$!: Observable<SourceType | Playlist | null>;
  selectedSourcePlaylist!: Playlist | null;
  selectedDestinationPlaylist!: Playlist | null;

  selectedSource!: SourceType;
  selectedDestination!: SourceType;
  selectedSyncType!: SyncType;

  syncTypeForm = new FormControl<SyncType>(SyncType.MERGE);

  playlistToTransferToSpotify$ = new Subject<Playlist>();
  playlistToTransferToMusicStore$ = new Subject<Playlist>();

  combinedSubjectSubscription!: Subscription;
  selectedPlaylistSubscription!: Subscription;
  selectedDestinationPlaylistSubscription!: Subscription;
  selectedDestinationSubscription!: Subscription;

  constructor(
    private matDialog: MatDialog,
    private transferPlaylistsService: TransferPlaylistsService,
    private spotifyService: SpotifyService,
    private fb: FormBuilder,
    private playlistsService: PlaylistsService,
    private syncPlaylistService: SyncPlaylistsService
  ) {}

  ngOnInit(): void {
    this.syncTypeForm.setValue(null);

    this.syncTypeForm.valueChanges.subscribe((val) => {
      if (val && Array.isArray(val)) {
        const stringVal = val[0];
        if (!stringVal) {
          this.syncTypeForm.disable({ emitEvent: false });
        } else {
          this.syncTypeForm.enable({ emitEvent: false });
          this.selectedSyncType = stringVal;
          console.log(stringVal);
        }
      }
    });
  }

  initiateSync() {
    if (!this.selectedSourcePlaylist || !this.selectedDestinationPlaylist) {
      //handle case
      return;
    }
    console.log('initiate merge sync');
    console.log(this.syncTypeForm.value);
    const syncType = this.selectedSyncType;
    if (syncType === SyncType.MERGE) {
      this.syncPlaylistService
        .mergePlaylists(
          this.selectedSourcePlaylist,
          this.selectedDestinationPlaylist
        )
        .subscribe({
          next: (id: string) => {
            this.syncComplete = true;
            console.log(`playlist merged successfully. DestinationID: ${id}`);
          },
          error: (err: any) => {
            //handle error
            console.log(err);
            console.log('error merging playlist');
          },
        });
    }
  }

  onSelectedSourceChanged($event: SourceType) {
    this.selectedSource = $event;
  }

  onSelectedDestinationChanged($event: SourceType) {
    this.selectedDestination = $event;
  }

  onSelectedSourcePlaylistChanged($event: PlaylistSelectedEvent) {
    console.log($event);

    this.selectedSourcePlaylist = $event.playlist;
  }

  onSelectedDestinationPlaylistChanged($event: PlaylistSelectedEvent) {
    this.selectedDestinationPlaylist = $event.playlist;
  }

  getSyncTypeAsString(syncType: SyncType) {
    return syncType.toString().toUpperCase();
  }

  ngOnDestroy(): void {}

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

  get SyncType() {
    return SyncType;
  }
}
