import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlaylistSelectorComponent } from './playlist-selector/playlist-selector.component';
import { SourceSelectorComponent } from './source-selector/source-selector.component';
import { Playlist, SourceType, TransferSide } from '../../models/music.model';
import { SongSelectorComponent } from './song-selector/song-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { TransferPlaylistsService } from './transfer-playlists.service';
import { merge, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-transfer-playlists',
  standalone: true,
  imports: [CommonModule, MatCardModule, SourceSelectorComponent, PlaylistSelectorComponent, SongSelectorComponent, MatButtonModule],
  templateUrl: './transfer-playlists.component.html',
  styleUrl: './transfer-playlists.component.scss',
})
export class TransferPlaylistsComponent implements OnInit{

  transferReady = false;

  combinedSubject$!: Observable<SourceType | Playlist | null>;

  constructor(private matDialog: MatDialog, private transferPlaylistsService: TransferPlaylistsService, private spotifyService: SpotifyService){

  }

  ngOnInit(): void {
      this.combinedSubject$ = merge(this.transferPlaylistsService.selectedSource$, this.transferPlaylistsService.selectedDestination$, this.transferPlaylistsService.selectedPlaylist$);

      this.combinedSubject$.subscribe({
        next: (subjectChanged)=>{
          console.log('emitted')
          if (this.transferPlaylistsService.selectedSource$.value !== SourceType.NONE && this.transferPlaylistsService.selectedDestination$.value !== SourceType.NONE && this.transferPlaylistsService.selectedPlaylist$.value !== null){
            this.transferReady = true;
          } else {
            this.transferReady = false;
          }
        }
      })
  }


  get TransferSide() {
    return TransferSide;
  }

  openTransferDialog(){
    this.matDialog.open(TransferDialogComponent, {
      minHeight: '400px',
      minWidth: '500px',
      data: {
        total: this.transferPlaylistsService.selectedSongs$.value.length
      }
    });
  }
}
