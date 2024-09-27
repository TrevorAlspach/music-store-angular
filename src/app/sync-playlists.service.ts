import { Injectable, signal } from '@angular/core';
import { PlaylistsService } from './services/syncify/playlists.service';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  SourceType,
  Song,
  Playlist,
  PlaylistDetails,
  SpotifyPlaylistDetails,
  SpotifySong,
} from './models/music.model';
import { SpotifySdkService } from './services/external-services/spotify-sdk.service';
import { TransferPlaylistsService } from './components/transfer-playlists/transfer-playlists.service';
import { SpotifyService } from './services/external-services/spotify.service';
import {
  Track,
  Playlist as SdkPlaylist,
  PlaylistedTrack,
} from '@spotify/web-api-ts-sdk';
import { SpotifyPlaylistResponse } from './models/spotify-api.model';

@Injectable({
  providedIn: 'root',
})
export class SyncPlaylistsService {
  constructor(
    private playlistsService: PlaylistsService,
    private spotifySdkService: SpotifySdkService,
    private spotifyService: SpotifyService,
    private transferPlaylistService: TransferPlaylistsService
  ) {}

  mergePlaylists(source: Playlist, destination: Playlist) {
    let sourceDetails: PlaylistDetails;
    let destinationDetails: PlaylistDetails;

    return forkJoin([
      this.getPlaylistDetails(source),
      this.getPlaylistDetails(destination),
    ]).pipe(
      switchMap((result) => {
        console.log(result);
        const destinationSongSet = new Set();
        const songsToAdd = [];
        sourceDetails = result[0] as PlaylistDetails;
        destinationDetails = result[1] as PlaylistDetails;

        for (let song of destinationDetails.songs) {
          destinationSongSet.add({
            name: song.name,
            artist: song.artist,
          });
        }

        for (let song of sourceDetails.songs) {
          if (
            !destinationSongSet.has({
              name: song.name,
              artist: song.artist,
            })
          ) {
            songsToAdd.push(song);
          }
        }

        if (destination.source === SourceType.SPOTIFY) {
          return this.spotifyService
            .addSongsToPlaylist(songsToAdd, destination.id)
            .pipe(map((spotifyPlaylistResponse) => spotifyPlaylistResponse.id));
        } else if (destination.source === SourceType.SYNCIFY) {
          const newPlaylist = destinationDetails;
          newPlaylist.songs.push(...songsToAdd);
          return this.transferPlaylistService
            .transferSongsToMusicStore(newPlaylist)
            .pipe(map((playlist) => playlist.id));
        } else {
          return of('');
        }
      })
    );
  }

  replacePlaylistSync(
    source: Playlist,
    destination: Playlist
  ): Observable<string> {
    let sourceDetails: PlaylistDetails;
    let destinationDetails: PlaylistDetails;

    return forkJoin([
      this.getPlaylistDetails(source),
      this.getPlaylistDetails(destination),
    ]).pipe(
      switchMap((result) => {
        console.log(result);
        const songsToAdd: Song[] = [];
        sourceDetails = result[0] as PlaylistDetails;
        destinationDetails = result[1] as PlaylistDetails;

        songsToAdd.push(...sourceDetails.songs);
        destinationDetails.songCount = songsToAdd.length;

        if (destination.source === SourceType.SPOTIFY) {
          return this.spotifySdkService
            .deleteAllTracksFromPlaylist(destination.id)
            .pipe(
              switchMap((res) => {
                return this.spotifyService.addSongsToPlaylist(
                  songsToAdd,
                  destination.id
                );
              })
            )
            .pipe(map((playlist) => playlist.id));
        } else if (destination.source === SourceType.SYNCIFY) {
          const newPlaylist = destinationDetails;
          newPlaylist.songs = songsToAdd;

          for (let song of newPlaylist.songs) {
            song.imageUrl = 'assets/defaultAlbum.jpg';
          }

          return this.transferPlaylistService
            .transferSongsToMusicStore(newPlaylist)
            .pipe(map((playlist) => playlist.id));
        } else {
          return of('');
        }
      })
    );
  }

  getPlaylistDetails(playlist: Playlist) {
    if (playlist.source === SourceType.SPOTIFY) {
      return this.spotifySdkService.getPlaylistFromId(playlist.id).pipe(
        map(
          (playlist: SdkPlaylist<Track>) =>
            <PlaylistDetails>{
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
              imageUrl: 'assets/defaultAlbum.jpg',
              songCount: playlist.tracks.total,
              source: SourceType.SPOTIFY,
              href: playlist.external_urls.spotify,
            }
        )
      );
    } else if (playlist.source === SourceType.SYNCIFY) {
      return this.playlistsService.getPlaylist(playlist.id);
    } else {
      return throwError(() => {});
    }
  }

  millisToMinutesAndSeconds(millis: any) {
    var minutes = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}
