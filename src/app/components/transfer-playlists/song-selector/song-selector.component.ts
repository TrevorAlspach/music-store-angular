import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Playlist, PlaylistDetails, Song, SourceType } from '../../../models/music.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { switchMap } from 'rxjs';
import { SpotifyService } from '../../../services/spotify.service';
import { SpotifyPlaylistResponse, SpotifyTrackWrapper } from '../../../models/spotify-api.model';

@Component({
  selector: 'app-song-selector',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule],
  templateUrl: './song-selector.component.html',
  styleUrl: './song-selector.component.scss',
})
export class SongSelectorComponent implements OnInit {
  readonly songColumns = ['select','name', 'artist', 'album', 'time'];

  songsDataSource: MatTableDataSource<Song> = new MatTableDataSource();
  selection = new SelectionModel<Song>(true, []);

  constructor(
    private transferPlaylistsService: TransferPlaylistsService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    this.transferPlaylistsService.selectedPlaylist$
      .pipe(
        switchMap((playlist) =>
          this.spotifyService.getPlaylistFromId(playlist.id as string)
        )
      )
      .subscribe({
        next: (playlist: SpotifyPlaylistResponse) => {
          //console.log(playlist);
          //this.isLoading = false;

          let imageUrl: string;
          if (playlist.images && playlist.images.length > 0) {
            imageUrl = playlist.images[0].url;
          } else {
            imageUrl = '';
          }

          const songs = playlist.tracks.items.map(
              (spotifyTrack: SpotifyTrackWrapper) => {
                return <Song>{
                  name: spotifyTrack.track.name,
                  album: spotifyTrack.track.album.name,
                  artist: spotifyTrack.track.artists
                    .map((artist) => {
                      return artist.name;
                    })
                    .join(', '),
                  time: this.millisToMinutesAndSeconds(
                    spotifyTrack.track.duration_ms
                  ),
                  image_url: spotifyTrack.track.album.images[0].url,
                };
              }
            ); 
            
          this.songsDataSource.data = songs;
          this.selection.select(...this.songsDataSource.data);
          }});
  }

  millisToMinutesAndSeconds(millis: any) {
    var minutes = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.songsDataSource.data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.songsDataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: Song): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
}
