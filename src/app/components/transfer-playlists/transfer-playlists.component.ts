import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlaylistSelectorComponent } from './playlist-selector/playlist-selector.component';
import { SourceSelectorComponent } from './source-selector/source-selector.component';
import { TransferSide } from '../../models/music.model';
import { SongSelectorComponent } from './song-selector/song-selector.component';

@Component({
  selector: 'app-transfer-playlists',
  standalone: true,
  imports: [MatCardModule, SourceSelectorComponent, PlaylistSelectorComponent, SongSelectorComponent],
  templateUrl: './transfer-playlists.component.html',
  styleUrl: './transfer-playlists.component.scss',
})
export class TransferPlaylistsComponent {
  get TransferSide() {
    return TransferSide;
  }
}
