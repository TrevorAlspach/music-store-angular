import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Playlist, SourceType } from '../../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class TransferPlaylistsService {

  constructor() { }

  selectedSource$: BehaviorSubject<SourceType> = new BehaviorSubject<SourceType>(SourceType.NONE);
  selectedDestination$: BehaviorSubject<SourceType> = new BehaviorSubject<SourceType>(SourceType.NONE);

  selectedPlaylist$:Subject<Playlist> = new Subject<Playlist>();
}
