import { Injectable } from '@angular/core';
import { PlaylistsService } from './services/playlists.service';
import { Playlist } from '@spotify/web-api-ts-sdk';
import { BehaviorSubject } from 'rxjs';
import { SourceType, Song } from './models/music.model';

@Injectable({
  providedIn: 'root',
})
export class SyncPlaylistsService {
  constructor(private playlistsService: PlaylistsService) {}

  selectedSource$: BehaviorSubject<SourceType> =
    new BehaviorSubject<SourceType>(SourceType.NONE);
  selectedDestination$: BehaviorSubject<SourceType> =
    new BehaviorSubject<SourceType>(SourceType.NONE);

  selectedSourcePlaylist$: BehaviorSubject<Playlist | null> =
    new BehaviorSubject<Playlist | null>(null);

  selectedDestinationPlaylist$: BehaviorSubject<Playlist | null> =
    new BehaviorSubject<Playlist | null>(null);


  //selectedSongs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  //transferedSongs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
}
