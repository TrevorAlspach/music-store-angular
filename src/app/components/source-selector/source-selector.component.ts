import { Component, Input } from '@angular/core';
import { SourceType } from '../../models/music.model';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-source-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './source-selector.component.html',
  styleUrl: './source-selector.component.scss',
})
export class SourceSelectorComponent {
  @Input() title!: string;

  step: number = 0;

  //playlists: Playlist[] = [];

  constructor(private spotifyService: SpotifyService) {}

  onInitialAddClicked() {
    this.step = 1;
  }

  back() {
    this.step--;
  }

  sourceSelected(sourceType: SourceType){
    if (sourceType === SourceType.SPOTIFY){
      
    }
  }

  get SourceType() {
    return SourceType;
  }
}
