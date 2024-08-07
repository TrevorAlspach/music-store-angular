import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SourceType } from '../../models/music.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistEventService implements OnInit{

  constructor() { }

  playlistEvent$: Subject<PlaylistEvent> = new Subject();

  ngOnInit(){

  }
}

export type PlaylistEvent = {
  message:string;
  source: SourceType;
}
