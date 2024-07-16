import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Playlist, PlaylistDetails, Song, SourceType } from '../../models/music.model';
import { DiscogsService } from '../../services/discogs.service';
import { PlaylistsService } from '../../services/playlists.service';

@Injectable({
  providedIn: 'root'
})
export class TransferPlaylistsService {

  constructor(private discogsService: DiscogsService, private playlistsService: PlaylistsService) { }

  selectedSource$: BehaviorSubject<SourceType> = new BehaviorSubject<SourceType>(SourceType.NONE);
  selectedDestination$: BehaviorSubject<SourceType> = new BehaviorSubject<SourceType>(SourceType.NONE);

  selectedPlaylist$:Subject<Playlist> = new Subject<Playlist>();
  selectedSongs$:BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  transferedSongs$:BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  currentProgress$:Subject<number> = new Subject();

  transferSongs(destination: SourceType, songs: Song[]){
    //const discogsSearchRequests = [];
    for (let song of songs){
      /* discogsSearchRequests.push(
        this.discogsService.searchTracks(song.name,song.artist,song.album)
      ) */
     song.imageUrl = 'https://www.shareicon.net/data/128x128/2015/10/19/658317_music_512x512.png';
    }

    /* this.discogsService.rateLimitRequests(discogsSearchRequests).subscribe({
      next: (res)=>{
      }
    }) */

    if (destination === SourceType.MUSIC_STORE){
      const newPlaylist = <PlaylistDetails>{
        songs: songs,
        song_count: songs.length,
        source: SourceType.MUSIC_STORE,
        imageUrl:
          'https://www.shareicon.net/data/128x128/2015/10/19/658317_music_512x512.png',
        name: 'name2',
        description: 'description',
      };

      this.playlistsService.createNewPlaylist(newPlaylist).subscribe({
        next: (playlist: Playlist)=>{
          console.log(playlist)
        }
      })
    }


  }
}
