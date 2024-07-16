import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist, PlaylistDetails } from '../models/music.model';

@Injectable({
  providedIn: 'root',
})
export class PlaylistsService {
  apiBaseUrl: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  fetchAllPlaylistsForUser() {
    return this.http.get<any>(this.apiBaseUrl + 'api/playlist/allPlaylists');
  }

  createNewPlaylist( playlist: Playlist) {
    return this.http.post<Playlist>(this.apiBaseUrl + 'api/playlist/createPlaylist', playlist)
  }

  createNewPlaylistWithSongs( playlist: PlaylistDetails){
    return this.http.post<Playlist>(
      this.apiBaseUrl + 'api/playlist/createPlaylistWithSongs',
      playlist
    );
  }
}
