import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Playlist, Song, SourceType } from '../../models/music.model';
import { DiscogsService } from '../../services/discogs.service';

@Injectable({
  providedIn: 'root'
})
export class TransferPlaylistsService {

  constructor(private discogsService: DiscogsService) { }

  selectedSource$: BehaviorSubject<SourceType> = new BehaviorSubject<SourceType>(SourceType.NONE);
  selectedDestination$: BehaviorSubject<SourceType> = new BehaviorSubject<SourceType>(SourceType.NONE);

  selectedPlaylist$:Subject<Playlist> = new Subject<Playlist>();
  selectedSongs$:BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  transferedSongs$:BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  currentProgress$:Subject<number> = new Subject();

  transferSongs(destination: SourceType, songs: Song[]){
    const discogsSearchRequests = [];
    for (let song of songs){
      discogsSearchRequests.push(
        this.discogsService.searchTracks(song.name,song.artist,song.album)
      )
    }

    this.discogsService.rateLimitRequests(discogsSearchRequests).subscribe({
      next: (res)=>{
        console.log(res)
      }
    })

    if (destination === SourceType.MUSIC_STORE){

    }


  }
}
