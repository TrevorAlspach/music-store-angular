import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import {
  Playlist,
  PlaylistDetails,
  Song,
  SourceType,
} from '../../models/music.model';
import { PlaylistsService } from '../../services/syncify/playlists.service';

@Injectable({
  providedIn: 'root',
})
export class TransferPlaylistsService {
  constructor(private playlistsService: PlaylistsService) {}

  selectedSource$: BehaviorSubject<SourceType> =
    new BehaviorSubject<SourceType>(SourceType.NONE);
  selectedDestination$: BehaviorSubject<SourceType> =
    new BehaviorSubject<SourceType>(SourceType.NONE);

  selectedSourcePlaylist$: BehaviorSubject<Playlist | null> =
    new BehaviorSubject<Playlist | null>(null);

  selectedDestinationPlaylist$: BehaviorSubject<Playlist | null> =
    new BehaviorSubject<Playlist | null>(null);
  selectedSongs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  transferedSongs$: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  currentProgress$: Subject<number> = new Subject();

  transferSongsToMusicStore(destinationDetails: Playlist) {
    return this.playlistsService.createNewPlaylist(destinationDetails);
  }
}
