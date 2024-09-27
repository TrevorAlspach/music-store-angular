import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Playlist,
  PlaylistDetails,
  Song,
  SourceType,
} from '../../../models/music.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { TransferPlaylistsService } from '../transfer-playlists.service';
import { expand, reduce, Subscription, switchMap, tap } from 'rxjs';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import {
  SpotifyPlaylistResponse,
  SpotifyTrack,
  SpotifyTrackWrapper,
  SpotifyTracksObject,
} from '../../../models/spotify-api.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-song-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './song-selector.component.html',
  styleUrl: './song-selector.component.scss',
})
export class SongSelectorComponent implements OnInit {
  readonly songColumns = [/* 'select', */ 'name', 'artist', 'album', 'time'];
  isLoading = false;

  songsDataSource: MatTableDataSource<Song> = new MatTableDataSource();
  //selection = new SelectionModel<Song>(true, []);
  private subscription!: Subscription;

  constructor(
    private transferPlaylistsService: TransferPlaylistsService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    /*this.subscription = this.transferPlaylistsService.selectedPlaylist$
      .pipe(tap(() => {
        this.songsDataSource.data = []
        this.isLoading = true}))
      .pipe(
        switchMap((playlist: Playlist | null) =>
          this.getAllSongsOfPlaylist(playlist.id as string)
        )
      )
      .subscribe({
        next:
        (allSongs: SpotifyTrackWrapper[]) => {
          const songs = allSongs.map((spotifyTrack: SpotifyTrackWrapper) => {
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
              imageUrl: spotifyTrack.track.album.images[0].url,
              releaseYear: this.parseReleaseYearFromSpotifyDateString(spotifyTrack.track.album.release_date)
            };
          });

          this.songsDataSource.data = songs;
          this.transferPlaylistsService.selectedSongs$.next(songs);
          console.log('All songs:', allSongs);
          this.isLoading = false;
        },
        error:(error) => {
          console.error('Error:', error);
        }
  });*/
  }

  getAllSongsOfPlaylist(playlistId: string) {
    const initialOffset = 0;

    return this.spotifyService
      .getSongsOfPlaylist(playlistId, 50, initialOffset)
      .pipe(
        expand((response) =>
          response.next
            ? this.spotifyService.getSongsOfPlaylist(
                playlistId,
                50,
                response.offset + response.limit
              )
            : []
        ),
        reduce(
          (acc: SpotifyTrackWrapper[], response) => acc.concat(response.items),
          []
        )
      );
  }

  millisToMinutesAndSeconds(millis: any) {
    var minutes = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  parseReleaseYearFromSpotifyDateString(releaseDate: string): number {
    return Number.parseInt(releaseDate.slice(0, 3));
  }
}
