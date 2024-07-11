import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { Song } from '../../../models/music.model';

@Component({
  selector: 'app-review-transfer',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './review-transfer.component.html',
  styleUrl: './review-transfer.component.scss',
})
export class ReviewTransferComponent {
  constructor(private transferPlaylistsService: TransferPlaylistsService) {}

  readonly songColumns = [/* 'select', */ 'name', 'artist', 'album', 'time'];

  songsToTransferSource: MatTableDataSource<Song> = new MatTableDataSource();

  destinationSongsSource: MatTableDataSource<Song> = new MatTableDataSource();

  ngOnInit() {
    this.transferPlaylistsService.selectedSongs$.subscribe({
      next: (songs: Song[]) => {
        this.songsToTransferSource.data = songs;
      },
    });
  }
}
