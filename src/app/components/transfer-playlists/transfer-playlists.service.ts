import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {
  Playlist,
  PlaylistDetails,
  Song,
  SourceType,
} from '../../models/music.model';
import { PlaylistsService } from '../../services/playlists.service';

@Injectable({
  providedIn: 'root',
})
export class TransferPlaylistsService {
  constructor(
    private playlistsService: PlaylistsService
  ) {}

  selectedSource$: BehaviorSubject<SourceType> =
    new BehaviorSubject<SourceType>(SourceType.NONE);
  selectedDestination$: BehaviorSubject<SourceType> =
    new BehaviorSubject<SourceType>(SourceType.NONE);

  selectedPlaylist$: BehaviorSubject<Playlist | null> =
    new BehaviorSubject<Playlist | null>(null);
  selectedSongs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  transferedSongs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  currentProgress$: Subject<number> = new Subject();

  transferSongsToMusicStore(destinationDetails: Playlist) {
    /*  for (let song of songs){
     song.imageUrl = 'https://www.shareicon.net/data/128x128/2015/10/19/658317_music_512x512.png';
    } */
    return this.playlistsService.createNewPlaylist(destinationDetails);
  }
}
