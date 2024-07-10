import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlaylistSelectorComponent } from '../playlists/playlist-selector/playlist-selector.component';
import { SourceSelectorComponent } from '../source-selector/source-selector.component';

@Component({
  selector: 'app-transfer-playlists',
  standalone: true,
  imports: [MatCardModule, SourceSelectorComponent],
  templateUrl: './transfer-playlists.component.html',
  styleUrl: './transfer-playlists.component.scss'
})
export class TransferPlaylistsComponent {

}
