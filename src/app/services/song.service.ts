import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  apiBaseUrl: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  findSongByName(name: string) {
    return this.http.get<any>(this.apiBaseUrl + "api/song/findByName?name=123");
  }
}
