import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReleaseType } from '../models/music.model';
import { Observable, concatMap, delay, from, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscogsService {
  readonly discogsToken = environment.discogsToken;
  readonly discogsSearchUrl = environment.discogsSearchUrl;

  readonly discogsRateLimit = 1000;

  constructor(private httpClient: HttpClient) {}

  searchTracks(
    trackName: string,
    artistName: string,
    albumName: string,
    releaseYear: number,
    releaseType: ReleaseType = ReleaseType.ALBUM,
    country: string = 'US'
  ) {
    return this.httpClient.get(this.discogsSearchUrl, {
      params: {
        track: trackName,
        artist: artistName,
        country: country,
        format: releaseType,
        year: releaseYear,
        title: albumName,
      },
      headers: {
        Authorization: `Discogs token=${this.discogsToken}`,
      },
    });
  }

  rateLimitRequests(observables: Observable<any>[]): Observable<any[]> {
    return from(observables).pipe(
      concatMap((obs) => obs.pipe(delay(this.discogsRateLimit))),
      toArray()
    );
  }
}
