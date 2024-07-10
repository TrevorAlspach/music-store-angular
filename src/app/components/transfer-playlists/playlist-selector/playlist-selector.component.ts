import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Playlist, SourceType, TransferSide } from '../../../models/music.model';
import { SpotifyService } from '../../../services/spotify.service';
import { SpotifySimplePlaylist } from '../../../models/spotify-api.model';
import { Subscription, map } from 'rxjs';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TransferPlaylistsService } from '../transfer-playlists.service';

@Component({
  selector: 'app-playlist-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss',
})
export class PlaylistSelectorComponent implements OnInit, OnDestroy , AfterViewInit{
  @Input() sourceType!: SourceType;

  @Input() transferSide!: TransferSide;

  //playlists: Playlist[] = [];
  playlistsDataSource: MatTableDataSource<Playlist> = new MatTableDataSource<Playlist>();

  selectedSourceSubscription!: Subscription;

  readonly tableColumns = ['name', 'source'];

  @ViewChild(MatTable) table!: MatTable<Playlist>;

  constructor(
    private spotifyService: SpotifyService,
    private transferPlaylistsService: TransferPlaylistsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    //this.loadPlaylists(this.sourceType);
    if (this.transferSide === TransferSide.SOURCE) {
      this.selectedSourceSubscription =
        this.transferPlaylistsService.selectedSource$.subscribe({
          next: (sourceType: SourceType) => {
            if (sourceType === SourceType.NONE) {
              return;
            }
            this.loadPlaylists(sourceType);
          },
        });
    }

    if (this.transferSide === TransferSide.DESTINATION) {
      this.selectedSourceSubscription =
        this.transferPlaylistsService.selectedDestination$.subscribe({
          next: (sourceType: SourceType) => {
            if (sourceType === SourceType.NONE) {
              return;
            }
            this.loadPlaylists(sourceType);
          },
        });
    }
  }

  ngOnDestroy(): void {
     // this.s
  }

  loadPlaylists(sourceType: SourceType) {
    if (sourceType === SourceType.SPOTIFY) {
      console.log('spotify');
      this.spotifyService
        .getPlaylistsOfLoggedInUser()
        .pipe(map((response) => response.items))
        .subscribe({
          next: (playlists: SpotifySimplePlaylist[]) => {
            const mappedPlaylists = []

            for (let playlist of playlists) {
              let imageUrl: string;
              if (playlist.images && playlist.images.length > 0) {
                imageUrl = playlist.images[0].url;
              } else {
                imageUrl = '';
              }

              mappedPlaylists.push({
                name: playlist.name,
                id: playlist.id,
                source: SourceType.SPOTIFY,
                imageUrl: imageUrl,
                href: playlist.href,
              });
            }
            this.playlistsDataSource.data = mappedPlaylists;
            this.changeDetectorRef.detectChanges();
          },
        });
    }
  }

  rowSelected(row: Playlist){
    console.log(row)
    this.transferPlaylistsService.selectedPlaylist$.next(row);
  }

  get SourceType() {
    return SourceType;
  }
}
