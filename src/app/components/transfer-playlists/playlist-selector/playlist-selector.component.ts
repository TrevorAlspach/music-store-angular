import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  Playlist,
  PlaylistSelectedEvent,
  SourceType,
  TransferSide,
} from '../../../models/music.model';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import { SpotifySimplePlaylist } from '../../../models/spotify-api.model';
import { Subscription, map } from 'rxjs';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { PlaylistsService } from '../../../services/syncify/playlists.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppleMusicService } from '../../../services/external-services/apple-music.service';
import { LibraryPlaylist } from '../../../models/apple-music.model';

@Component({
  selector: 'app-playlist-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss',
})
export class PlaylistSelectorComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() sourceType!: SourceType;

  @Input() transferSide!: TransferSide;

  @Output() onPlaylistSelected = new EventEmitter<PlaylistSelectedEvent>();

  playlistsDataSource: MatTableDataSource<Playlist> =
    new MatTableDataSource<Playlist>();
  selection = new SelectionModel<Playlist>(false, []);

  selectedSourceSubscription!: Subscription;
  sourceSelected = false;
  isLoading = false;

  readonly tableColumns = ['select', 'name', 'source', 'songCount'];

  @ViewChild(MatTable) table!: MatTable<Playlist>;

  constructor(
    private spotifyService: SpotifyService,
    private transferPlaylistsService: TransferPlaylistsService,
    private changeDetectorRef: ChangeDetectorRef,
    private playlistsService: PlaylistsService,
    private appleMusicService: AppleMusicService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    //this.loadPlaylists(this.sourceType);
    if (this.transferSide === TransferSide.SOURCE) {
      this.selectedSourceSubscription =
        this.transferPlaylistsService.selectedSource$.subscribe({
          next: (sourceType: SourceType) => {
            if (sourceType === SourceType.NONE) {
              this.sourceSelected = false;
              return;
            }
            this.sourceSelected = true;
            this.loadPlaylists(sourceType);
          },
        });
    }

    if (this.transferSide === TransferSide.DESTINATION) {
      this.selectedSourceSubscription =
        this.transferPlaylistsService.selectedDestination$.subscribe({
          next: (sourceType: SourceType) => {
            if (sourceType === SourceType.NONE) {
              this.sourceSelected = false;
              return;
            }
            this.sourceSelected = true;
            this.loadPlaylists(sourceType);
          },
        });
    }
  }

  ngOnDestroy(): void {
    // this.s
  }

  loadPlaylists(sourceType: SourceType) {
    this.isLoading = true;
    if (sourceType === SourceType.SPOTIFY) {
      this.spotifyService
        .getPlaylistsOfLoggedInUser()
        .pipe(map((response) => response.items))
        .subscribe({
          next: (playlists: SpotifySimplePlaylist[]) => {
            const mappedPlaylists = [];

            for (let playlist of playlists) {
              let imageUrl: string;
              if (playlist.images && playlist.images.length > 0) {
                imageUrl = playlist.images[0].url;
              } else {
                imageUrl = 'assets/defaultAlbum.jpg';
              }

              mappedPlaylists.push({
                name: playlist.name,
                id: playlist.id,
                source: SourceType.SPOTIFY,
                imageUrl: imageUrl,
                href: playlist.href,
                songCount: playlist.tracks.total,
              });
            }
            this.playlistsDataSource.data = mappedPlaylists;
            this.changeDetectorRef.detectChanges();
            this.isLoading = false;
          },
        });
    }
    if (sourceType === SourceType.SYNCIFY) {
      this.playlistsService.fetchAllPlaylistsForUser().subscribe({
        next: (playlists: Playlist[]) => {
          for (let playlist of playlists) {
            if (!playlist.imageUrl || playlist.imageUrl === '') {
              playlist.imageUrl = 'assets/defaultAlbum.jpg';
            }
          }

          this.playlistsDataSource.data = playlists;
          this.changeDetectorRef.detectChanges();
          this.isLoading = false;
        },
      });
    }

    if (sourceType === SourceType.APPLE_MUSIC) {
      this.appleMusicService.getPlaylistsOfCurrentUser().subscribe({
        next: (playlists: LibraryPlaylist[]) => {
          for (let playlist of playlists) {
            let imageUrl: string = 'assets/defaultAlbum.jpg';
            if (playlist.attributes.artwork.url) {
              imageUrl = this.appleMusicService.formatImageUrl(
                playlist.attributes.artwork.url,
                200,
                200
              );
            }

            this.playlistsDataSource.data.push({
              name: playlist.attributes.name,
              id: playlist.id,
              source: SourceType.APPLE_MUSIC,
              imageUrl: imageUrl,
              href: playlist.href,
              songCount: 0,
            });
          }
          this.isLoading = false;
        },
      });
    }
  }

  rowSelected(row: Playlist) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      if (this.transferSide === TransferSide.SOURCE) {
        this.transferPlaylistsService.selectedSourcePlaylist$.next(null);
      } else {
        this.transferPlaylistsService.selectedDestinationPlaylist$.next(null);
      }

      this.onPlaylistSelected.emit(<PlaylistSelectedEvent>{
        playlist: null,
        sourceType: this.sourceType,
        transferSide: this.transferSide,
      });
    } else {
      if (this.transferSide === TransferSide.SOURCE) {
        this.transferPlaylistsService.selectedSourcePlaylist$.next(row);
      } else {
        this.transferPlaylistsService.selectedDestinationPlaylist$.next(row);
      }
      this.onPlaylistSelected.emit(<PlaylistSelectedEvent>{
        playlist: row,
        sourceType: this.sourceType,
        transferSide: this.transferSide,
      });

      this.selection.select(row);
    }
  }

  get SourceType() {
    return SourceType;
  }
}
