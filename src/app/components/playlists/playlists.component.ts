import { Component } from '@angular/core';
import { PlaylistsService } from '../../services/playlists.service';
import { Playlist } from '../../models/music.model';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss'
})
export class PlaylistsComponent {
  playlist: Playlist = {
    songs: [],
    name: "ber"
  }

  playlists: Playlist[] = [];

  constructor(private playlistsService: PlaylistsService){

  }

  getPlaylistsForUser(){
    this.playlistsService.fetchAllPlaylistsForUser().subscribe({
      next: (res)=>{
        console.log(res)
        this.playlists = res;
      }
    })
  }

  createPlaylist(){
    this.playlistsService.createNewPlaylist(this.playlist).subscribe({
      next: (res) =>{
        console.log(res)
      }
    })
  }
}
