import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SpotifyImage, SpotifySimplePlaylist } from '../../../models/spotify-api.model';
import { Playlist } from '../../../models/music.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'playlist-large',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './playlist-large.component.html',
  styleUrl: './playlist-large.component.scss',
})
export class PlaylistLargeComponent implements OnInit {
  //@Input() playlist!: SpotifySimplePlaylist;
  @Input() playlist!: Playlist;
  hovered = false;

  //imageUrl!: string;

  constructor(private router: Router) {}

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  openMenu() {
    this.menuTrigger.openMenu();
  }

  mouseLeave(){
    if (!this.menuTrigger.menuOpen){
      this.hovered = false;
    }
  }


  ngOnInit(): void {
    /*   if (this.playlist.images && this.playlist.images.length > 0){
      this.imageUrl = this.playlist.images[0].url;
    } else {
      
    } */
  }

  openPlaylistDetails() {
    this.router.navigate([
      '/playlist-details',
      this.playlist.source,
      this.playlist.id,
    ]);
  }
}
