import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist, PlaylistDetails } from '../../models/music.model';
import { pipe, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaylistsService {
  apiBaseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  fetchAllPlaylistsForUser() {
    return this.http.get<Playlist[]>(this.apiBaseUrl + 'playlist/allPlaylists');
  }

  getPlaylist(id: string) {
    return this.http.get<PlaylistDetails>(this.apiBaseUrl + `playlist/${id}`);
  }

  createNewPlaylist(playlist: Playlist) {
    return this.http.post<Playlist>(
      this.apiBaseUrl + 'playlist/createPlaylist',
      playlist
    );
  }

  deletePlaylist(id: string) {
    return this.http.delete<Playlist>(
      this.apiBaseUrl + `playlist/deletePlaylist/${id}`
    );
  }

  createNewPlaylistWithSongs(playlist: PlaylistDetails) {
    return this.http.post<Playlist>(
      this.apiBaseUrl + 'playlist/createPlaylistWithSongs',
      playlist
    );
  }
}
