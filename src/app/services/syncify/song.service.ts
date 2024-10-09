import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  apiBaseUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  findSongByName(name: string) {
    return this.http.get<any>(this.apiBaseUrl + 'song/findByName?name=123');
  }
}
