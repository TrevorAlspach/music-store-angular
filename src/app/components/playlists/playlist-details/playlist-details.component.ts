import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist, PlaylistDetails, Song, SourceType } from '../../../models/music.model';
import { CommonModule, Location } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpotifyService } from '../../../services/spotify.service';
import { SpotifyPlaylistResponse, SpotifySimplePlaylist, SpotifyTrackWrapper } from '../../../models/spotify-api.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlaylistsService } from '../../../services/playlists.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss'
})
export class PlaylistDetailsComponent implements OnInit{
  readonly songColumns = [ 'name', 'artist', 'album', 'time']

  @Input() 
  id!: string;

  @Input()
  source!:SourceType;

/*   name!:string;
  description!:string; */

  playlist!: PlaylistDetails;

  isLoading: boolean = true;

  constructor(private spotifyService: SpotifyService, private location: Location, private playlistsService: PlaylistsService){

  }

  ngOnInit(){

    if (this.source === SourceType.SPOTIFY){

    this.spotifyService.getPlaylistFromId(this.id).subscribe({
      next: (playlist: SpotifyPlaylistResponse)=>{
        console.log(playlist)
        this.isLoading = false;

        let imageUrl: string;
        if (playlist.images && playlist.images.length > 0) {
          imageUrl = playlist.images[0].url;
        } else {
          imageUrl = 'assets/defaultAlbum.jpg';
        }

        this.playlist = <PlaylistDetails>{
          name: playlist.name,
          description: playlist.description,
          id: playlist.id,
          songs: playlist.tracks.items.map(
            (spotifyTrack: SpotifyTrackWrapper) => {
              return <Song>{
                name: spotifyTrack.track.name,
                album: spotifyTrack.track.album.name,
                artist: spotifyTrack.track.artists
                  .map((artist) => {
                    return artist.name;
                  })
                  .join(', '),
                time: this.millisToMinutesAndSeconds(
                  spotifyTrack.track.duration_ms
                ),
                imageUrl: spotifyTrack.track.album.images[0].url,
              };
            }
          ),
          imageUrl: imageUrl,
          songCount: playlist.tracks.total,
          source: SourceType.SPOTIFY,
          href: playlist.href,
        };
      }
    });
  } 

  if (this.source === SourceType.SYNCIFY){
    this.playlistsService.getPlaylist(this.id).subscribe({
      next: (res: PlaylistDetails)=>{
        console.log(res)
        this.playlist = res;
        this.isLoading = false;

        if (!this.playlist.imageUrl || this.playlist.imageUrl === ''){
          this.playlist.imageUrl = 'assets/defaultAlbum.jpg'
        }
      }
    })
  }
  }

  returnToPreviousPage(){
    this.location.back();
  }

  millisToMinutesAndSeconds(millis: any) {
  var minutes = Math.floor(millis / 60000);
  var seconds: any = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

}
