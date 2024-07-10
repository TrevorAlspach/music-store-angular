import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Playlist, SourceType } from '../../../models/music.model';
import { SpotifyService } from '../../../services/spotify.service';
import { SpotifySimplePlaylist } from '../../../models/spotify-api.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-playlist-selector',
  standalone: true,
  imports: [CommonModule,MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './playlist-selector.component.html',
  styleUrl: './playlist-selector.component.scss',
})
export class PlaylistSelectorComponent {
  
  @Input() title!:string;

  step: number = 0;

  //playlists: Playlist[] = [];
  
  constructor(private spotifyService: SpotifyService){}

  onInitialAddClicked(){
    this.step = 1;
  }

  back(){
    this.step--;
  }

/*   loadPlaylists(sourceType: SourceType){
    if (sourceType === SourceType.SPOTIFY){
      console.log('spotify')
      this.spotifyService
      .getPlaylistsOfLoggedInUser()
      .pipe(map((response) => response.items))
      .subscribe({
        next: (playlists: SpotifySimplePlaylist[]) => {
          for (let playlist of playlists) {
            let imageUrl: string;
            if (playlist.images && playlist.images.length > 0) {
              imageUrl = playlist.images[0].url;
            } else {
              imageUrl = '';
            }

            this.playlists.push({
              name: playlist.name,
              id: playlist.id,
              source: SourceType.SPOTIFY,
              imageUrl: imageUrl,
              href: playlist.href,
            });
          }
        },
      });
  }
    } */

  get SourceType(){
    return SourceType;
  }


}
