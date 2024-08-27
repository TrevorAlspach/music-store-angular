import { Injectable, OnInit } from '@angular/core';
import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '../../environments/environment.development';
import { defer, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifySdkService implements OnInit{
  sdk!: SpotifyApi;
  user: any;

  constructor() { 
    this.sdk = SpotifyApi.withUserAuthorization(
      environment.spotifyClientId,
      environment.spotifyRedirectUrl,
      [
        'user-read-private',
        'user-read-email',
        'playlist-modify-private',
        'playlist-modify-public',
        'streaming',
      ]
    );

    /* this.sdk.getAccessToken().then((token) => {
      console.log(token);
      console.log('token test');
    }); */
    //this.sdk.authenticate();

    //console.log(token);
    console.log('sdk Service!');
    this.sdk.playlists.getPlaylist('123').then((res)=>{
      console.log(res);
    })
  }

  ngOnInit(): void {

  }

  public getAccessToken(): Observable<AccessToken | null>{
    return defer(()=>from(this.sdk.getAccessToken()));
  }


}
