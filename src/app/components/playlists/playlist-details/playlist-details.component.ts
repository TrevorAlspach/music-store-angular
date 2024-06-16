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

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule, MatButtonModule],
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

  constructor(private spotifyService: SpotifyService, private location: Location){

  }

  ngOnInit(){

    this.spotifyService.getPlaylistFromId(this.id).subscribe({
      next: (playlist: SpotifyPlaylistResponse)=>{
        console.log(playlist)
        this.isLoading = false;

        let imageUrl: string;
        if (playlist.images && playlist.images.length > 0) {
          imageUrl = playlist.images[0].url;
        } else {
          imageUrl = '';
        }

        console.log(playlist)
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
                image_url: spotifyTrack.track.album.images[0].url,
              };
            }
          ),
          imageUrl: imageUrl,
          song_count: playlist.tracks.total,
          source: SourceType.SPOTIFY,
          href: playlist.href,
        };
      }
    })
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
