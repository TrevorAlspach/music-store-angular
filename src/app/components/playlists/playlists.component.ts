import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from '../../services/playlists.service';
import { Playlist, SourceType } from '../../models/music.model';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/spotify.service';
import { SpotifyPlaylistsResponse, SpotifySimplePlaylist } from '../../models/spotify-api.model';
import { PlaylistLargeComponent } from './playlist-large/playlist-large.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, PlaylistLargeComponent],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss'
})
export class PlaylistsComponent implements OnInit{
  /* playlist: Playlist = {
    songs: [],
    name: "ber",

  } */

  playlists: Playlist[] = [];
  spotifyPlaylists: Playlist[] = [];
  musicStorePlaylists: Playlist[] = []

  constructor(private playlistsService: PlaylistsService, private spotifyService: SpotifyService){

  }
  ngOnInit(): void {
    this.getSpotifyPlaylists();
  }

  getSpotifyPlaylists(){
    this.spotifyService.getPlaylists().pipe(map(
      response => response.items
    )).subscribe({
      next: (playlists: SpotifySimplePlaylist[])=>{
        /* console.log(response)
        this.spotifyPlaylists = response.items; */
        for (let playlist of playlists){
          let imageUrl:string;
          if (playlist.images && playlist.images.length > 0){
            imageUrl = playlist.images[0].url;
          } else {
            imageUrl = ''
          }

          this.spotifyPlaylists.push({
            name: playlist.name,
            id: playlist.id,
            songs: [],
            source: SourceType.SPOTIFY,
            imageUrl:  imageUrl,
            href: playlist.href
          })
        }
      }
    })
  }


  getMusicStorePlaylists(){
    this.playlistsService.fetchAllPlaylistsForUser().subscribe({
      next: (res)=>{
        console.log(res)
        this.playlists = res;
      }
    })
  }

/*   createPlaylist(){
    this.playlistsService.createNewPlaylist(this.playlist).subscribe({
      next: (res) =>{
        console.log(res)
      }
    })
  } */
}
