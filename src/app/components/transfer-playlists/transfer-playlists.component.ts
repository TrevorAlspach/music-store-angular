import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlaylistSelectorComponent } from './playlist-selector/playlist-selector.component';
import { SourceSelectorComponent } from './source-selector/source-selector.component';
import { TransferSide } from '../../models/music.model';
import { SongSelectorComponent } from './song-selector/song-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { TransferPlaylistsService } from './transfer-playlists.service';

@Component({
  selector: 'app-transfer-playlists',
  standalone: true,
  imports: [MatCardModule, SourceSelectorComponent, PlaylistSelectorComponent, SongSelectorComponent, MatButtonModule],
  templateUrl: './transfer-playlists.component.html',
  styleUrl: './transfer-playlists.component.scss',
})
export class TransferPlaylistsComponent {

  constructor(private matDialog: MatDialog, private transferPlaylistsService: TransferPlaylistsService){

  }


  get TransferSide() {
    return TransferSide;
  }

  openTransferDialog(){
    this.matDialog.open(TransferDialogComponent, {
      //minHeight: '80%',
      //minWidth: '90%',
      minHeight: '300px',
      minWidth: '500px',
      data: {
        total: this.transferPlaylistsService.selectedSongs$.value.length
      }
    });
  }
}
