import { Component, Input, OnInit } from '@angular/core';
import { SpotifyImage, SpotifySimplePlaylist } from '../../../models/spotify-api.model';
import { Playlist } from '../../../models/music.model';
import { Router } from '@angular/router';

@Component({
  selector: 'playlist-large',
  standalone: true,
  imports: [],
  templateUrl: './playlist-large.component.html',
  styleUrl: './playlist-large.component.scss'
})
export class PlaylistLargeComponent implements OnInit{

  //@Input() playlist!: SpotifySimplePlaylist;
  @Input() playlist!: Playlist;

  //imageUrl!: string;

  constructor(private router: Router){
  }

  ngOnInit(): void {
  /*   if (this.playlist.images && this.playlist.images.length > 0){
      this.imageUrl = this.playlist.images[0].url;
    } else {
      
    } */
          
  }

  openPlaylistDetails(){
    this.router.navigate(['/playlist-details', this.playlist.source, this.playlist.id])
  }

}
