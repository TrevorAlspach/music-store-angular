import { Component } from '@angular/core';
import { PlaylistsService } from '../../services/playlists.service';
import { Playlist } from '../../models/music.model';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/spotify.service';
import { SpotifyPlaylistsResponse, SpotifySimplePlaylist } from '../../models/spotify-api.model';
import { PlaylistLargeComponent } from './playlist-large/playlist-large.component';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, PlaylistLargeComponent],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss'
})
export class PlaylistsComponent {
  /* playlist: Playlist = {
    songs: [],
    name: "ber",

  } */

  playlists: Playlist[] = [];
  spotifyPlaylists: SpotifySimplePlaylist[] = [];

  constructor(private playlistsService: PlaylistsService, private spotifyService: SpotifyService){

  }

  getSpotifyPlaylists(){
    this.spotifyService.getPlaylists().subscribe({
      next: (response: SpotifyPlaylistsResponse)=>{
        console.log(response)
        this.spotifyPlaylists = response.items;
      }
    })
  }

/*   getPlaylistsForUser(){
    this.playlistsService.fetchAllPlaylistsForUser().subscribe({
      next: (res)=>{
        console.log(res)
        this.playlists = res;
      }
    })
  } */

/*   createPlaylist(){
    this.playlistsService.createNewPlaylist(this.playlist).subscribe({
      next: (res) =>{
        console.log(res)
      }
    })
  } */
}
