import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  SpotifyImage,
  SpotifySimplePlaylist,
} from '../../../models/spotify-api.model';
import { Playlist, SourceType } from '../../../models/music.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import { PlaylistsService } from '../../../services/syncify/playlists.service';
import { PlaylistEventService } from '../playlist-event.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'playlist-large',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './playlist-large.component.html',
  styleUrl: './playlist-large.component.scss',
})
export class PlaylistLargeComponent implements OnInit {
  //@Input() playlist!: SpotifySimplePlaylist;
  @Input() playlist!: Playlist;
  hovered = false;

  //imageUrl!: string;

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private playlistsService: PlaylistsService,
    private playlistEventService: PlaylistEventService
  ) {}

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  openMenu() {
    this.menuTrigger.openMenu();
  }

  mouseLeave() {
    if (!this.menuTrigger.menuOpen) {
      this.hovered = false;
    }
  }

  ngOnInit(): void {
    if (!this.playlist.imageUrl || this.playlist.imageUrl === '') {
      this.playlist.imageUrl = 'assets/defaultAlbum.jpg';
    }
  }

  openPlaylistDetails() {
    this.router.navigate([
      'home',
      'playlist-details',
      this.playlist.source,
      this.playlist.id,
    ]);
  }

  viewPlaylistInSpotify() {
    window.open(this.playlist.href);
  }

  deletePlaylist() {
    //delete only allowed for syncify playlists
    this.playlistsService.deletePlaylist(this.playlist.id).subscribe({
      next: (playlist: Playlist) => {
        this.playlistEventService.playlistEvent$.next({
          message: 'Playlist Deleted',
          source: SourceType.SYNCIFY,
        });
      },
    });
  }

  get SourceType() {
    return SourceType;
  }
}
