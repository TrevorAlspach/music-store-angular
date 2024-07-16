import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Song } from '../../../models/music.model';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatTableModule, MatProgressBarModule],
  templateUrl: './transfer-dialog.component.html',
  styleUrl: './transfer-dialog.component.scss',
})
export class TransferDialogComponent implements OnInit{
  total: number;

  i: number = 0;

  constructor(
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transferPlaylistsService: TransferPlaylistsService
  ) {
    this.total = data.total;
  }

  ngOnInit(){
    this.transferPlaylistsService.transferSongs(this.transferPlaylistsService.selectedDestination$.value,this.transferPlaylistsService.selectedSongs$.value)
  }
}
