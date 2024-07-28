import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaylistsService } from '../../services/playlists.service';
import { Playlist, SourceType } from '../../models/music.model';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyService } from '../../services/spotify.service';
import { SpotifyPlaylistsResponse, SpotifySimplePlaylist } from '../../models/spotify-api.model';
import { PlaylistLargeComponent } from './playlist-large/playlist-large.component';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlaylistDialogComponent } from './create-playlist-dialog/create-playlist-dialog.component';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    PlaylistLargeComponent,
    MatIconModule,
    SlickCarouselModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss',
})
export class PlaylistsComponent implements OnInit {
  @ViewChild('slickModalSpotify') slickModal!: SlickCarouselComponent;
  slideConfig = { slidesToShow: 6, slidesToScroll: 6, arrows: false };

  //playlists: Playlist[] = [];
  spotifyPlaylists: Playlist[] = [];

  musicStorePlaylists: Playlist[] = [];

  constructor(
    private playlistsService: PlaylistsService,
    private spotifyService: SpotifyService,
    private matDialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getSpotifyPlaylists();
    this.getMusicStorePlaylists();
  }

  getSpotifyPlaylists() {
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


            this.spotifyPlaylists.push({
              name: playlist.name,
              id: playlist.id,
              source: SourceType.SPOTIFY,
              imageUrl: imageUrl,
              href: playlist.href,
              songCount: playlist.tracks.total,
            });
          }
        },
      });
  }

  getMusicStorePlaylists() {
    this.playlistsService.fetchAllPlaylistsForUser().subscribe({
      next: (res) => {
        console.log(res);
        this.musicStorePlaylists = res;
      },
    });
  }

  spotifyCarouselBack() {
    this.slickModal.slickPrev();
  }

  spotifyCarouselNext() {
    this.slickModal.slickNext();
  }

  openCreatePlaylistDialog(sourceType: SourceType) {
    let dialogRef = this.matDialog.open(CreatePlaylistDialogComponent, {
      minHeight: '400px',
      minWidth: '500px',
      data: sourceType,
    });

    dialogRef.afterClosed().subscribe({
      next: (closeValue)=>{
        if (closeValue === true){
          if (sourceType === SourceType.SYNCIFY){
            this.getMusicStorePlaylists()
          }

          if (sourceType === SourceType.SPOTIFY){
            this.getSpotifyPlaylists();
          }
        }
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

  slickInit(e: any) {
    console.log('slick initialized');
  }

  get SourceType() {
    return SourceType;
  }
}
