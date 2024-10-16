import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Playlist,
  PlaylistDetails,
  Song,
  SourceType,
  SpotifyPlaylistDetails,
  SpotifySong,
} from '../../../models/music.model';
import { CommonModule, Location } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import {
  SpotifyPlaylistResponse,
  SpotifySimplePlaylist,
  SpotifyTrackWrapper,
} from '../../../models/spotify-api.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlaylistsService } from '../../../services/syncify/playlists.service';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { PlaylistEventService } from '../playlist-event.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpotifySdkService } from '../../../services/external-services/spotify-sdk.service';
import { switchMap } from 'rxjs';
import {
  Track,
  Playlist as SdkPlaylist,
  PlaylistedTrack,
} from '@spotify/web-api-ts-sdk';
import { AppleMusicService } from '../../../services/external-services/apple-music.service';
import { AMTrack, LibraryPlaylist } from '../../../models/apple-music.model';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss',
})
export class PlaylistDetailsComponent implements OnInit, OnChanges {
  readonly songColumns = ['name', 'artist', 'album', 'time'];

  @Input()
  id!: string;

  @Input()
  source!: SourceType;

  @Input()
  readonly: boolean = false;

  playlist!: PlaylistDetails;

  isLoading: boolean = true;

  constructor(
    private spotifyService: SpotifyService,
    private location: Location,
    private playlistsService: PlaylistsService,
    private playlistEventService: PlaylistEventService,
    private spotifySdkService: SpotifySdkService,
    private appleMusicService: AppleMusicService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPlaylistDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    /* if (changes['id'].previousValue) {
      this.loadPlaylistDetails();
    } */
  }

  loadPlaylistDetails() {
    this.isLoading = true;
    if (this.source === SourceType.SPOTIFY) {
      //this.spotifyService.getPlaylistFromId(this.id).subscribe({
      this.spotifySdkService.getPlaylistFromId(this.id).subscribe({
        next: (playlist: SdkPlaylist<Track>) => {
          console.log(playlist);
          let imageUrl: string = '';
          if (
            playlist.images &&
            Array.isArray(playlist.images) &&
            playlist.images.length > 0
          ) {
            if (playlist.images[0].url) {
              imageUrl = playlist.images[0].url;
            } else {
              imageUrl = 'assets/defaultAlbum.jpg';
            }
          } else {
            imageUrl = 'assets/defaultAlbum.jpg';
          }

          this.playlist = <SpotifyPlaylistDetails>{
            name: playlist.name,
            description: playlist.description,
            id: playlist.id,
            songs: playlist.tracks.items.map(
              (spotifyTrack: PlaylistedTrack<Track>) => {
                let songImageUrl = '';
                let album = spotifyTrack.track.album;
                if (
                  album.images &&
                  Array.isArray(album.images) &&
                  album.images.length > 0
                ) {
                  songImageUrl = spotifyTrack.track.album.images[0].url;
                } else {
                  songImageUrl = 'assets/defaultAlbum.jpg';
                }
                return <SpotifySong>{
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
                  imageUrl: songImageUrl,
                  hovered: false,
                  href: spotifyTrack.track.href,
                  remoteId: spotifyTrack.track.id,
                  contextUri: `spotify:track:${spotifyTrack.track.id}`,
                };
              }
            ),
            imageUrl: imageUrl,
            songCount: playlist.tracks.total,
            source: SourceType.SPOTIFY,
            href: playlist.external_urls.spotify,
            contextUri: playlist.uri,
          };
          this.isLoading = false;
        },
      });
    }

    if (this.source === SourceType.SYNCIFY) {
      this.playlistsService.getPlaylist(this.id).subscribe({
        next: (res: PlaylistDetails) => {
          console.log(res);
          this.playlist = res;
          this.isLoading = false;

          if (!this.playlist.imageUrl || this.playlist.imageUrl === '') {
            this.playlist.imageUrl = 'assets/defaultAlbum.jpg';
          }
        },
      });
    }

    if (this.source === SourceType.APPLE_MUSIC) {
      this.appleMusicService.getPlaylist(this.id).subscribe({
        next: async (playlists: LibraryPlaylist[]) => {
          const playlist = playlists[0];
          console.log(playlist);
          let imageUrl: string;
          if (playlist.attributes.artwork.url) {
            const isValid = await this.isImageValid(
              playlist.attributes.artwork.url
            );
            imageUrl = isValid
              ? playlist.attributes.artwork.url
              : 'assets/defaultAlbum.jpg';
          } else {
            imageUrl = 'assets/defaultAlbum.jpg';
          }

          this.playlist = <PlaylistDetails>{
            name: playlist.attributes.name,
            id: playlist.id,
            description: playlist.attributes.description
              ? playlist.attributes.description.standard
              : '',
            songCount: playlist.relationships.tracks.meta.total,
            source: SourceType.APPLE_MUSIC,
            imageUrl: imageUrl,
            href: playlist.href,
            songs: playlist.relationships.tracks?.data.map((track: AMTrack) => {
              return <Song>{
                id: track.id,
                name: track.attributes.name,
                album: track.attributes.albumName,
                artist: track.attributes.artistName,
                time: this.millisToMinutesAndSeconds(
                  track.attributes.durationInMillis
                ),
                imageUrl: track.attributes.artwork.url,
                releaseYear: Number(track.attributes.releaseDate.slice(0, 4)),
                hovered: false,
                href: track.href,
                genre: track.attributes.genreNames[0],
                remoteId: track.id,
              };
            }),
          };
          this.isLoading = false;
        },
      });
    }
  }

  isImageValid(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Error loading image
    });
  }

  viewPlaylistInSpotify() {
    window.open(this.playlist.href);
  }

  playSong(song: Song) {
    if (this.source === SourceType.SPOTIFY) {
      const spotifyPlaylist = this.playlist as SpotifyPlaylistDetails;
      const spotifySong = song as SpotifySong;
      this.spotifySdkService
        .startPlayback([spotifySong.contextUri])
        .pipe(
          //switchMap(()=>this.spotifySdkService.getTrackInfo(spotifySong.remoteId)),
          switchMap(() => this.spotifySdkService.preparePlayer())
        )
        .subscribe(() => {});
    }
  }

  deletePlaylist() {
    //delete only allowed for syncify playlists
    this.playlistsService.deletePlaylist(this.playlist.id).subscribe({
      next: (playlist: Playlist) => {
        this.playlistEventService.playlistEvent$.next({
          message: 'Playlist Deleted',
          source: SourceType.SYNCIFY,
        });
        this.router.navigate(['dashboard']);
      },
    });
  }

  returnToPreviousPage() {
    this.location.back();
  }

  millisToMinutesAndSeconds(millis: any) {
    var minutes = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  get SourceType() {
    return SourceType;
  }

  mouseLeave(song: Song) {
    song.hovered = false;
  }
}
