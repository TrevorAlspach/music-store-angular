/* import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlaylistsService } from '../../../services/syncify/playlists.service';
import { Playlist, SourceType, ViewType } from '../../../models/music.model';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import {
  SpotifyPlaylistsResponse,
  SpotifySimplePlaylist,
} from '../../../models/spotify-api.model';
import { PlaylistLargeComponent } from './../playlist-large/playlist-large.component';
import { map, switchMap, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CreatePlaylistDialogComponent } from './../create-playlist-dialog/create-playlist-dialog.component';
import {
  PlaylistEvent,
  PlaylistEventService,
} from './../playlist-event.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../dashboard/dashboard.service';
import { SpotifySdkService } from '../../../services/external-services/spotify-sdk.service';
import { SimplifiedPlaylist, TrackReference } from '@spotify/web-api-ts-sdk';
import { AppleMusicService } from '../../../services/external-services/apple-music.service';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-playlists-v2',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    PlaylistLargeComponent,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CarouselModule,
  ],
  templateUrl: './playlists-v2.component.html',
  styleUrl: './playlists-v2.component.scss',
})
export class PlaylistsV2Component implements OnInit {
  @Input() source!: SourceType;

  @Input() displayName!: string;

  playlists: Playlist[] = [];

  playlistsLoading = false;
  playlistsLoadError = false;

  slidesToShow = 5;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateSlidesToShow(event.target.innerWidth); // Update slides count on window resize
  }

  private updateSlidesToShow(width: number) {
    if (width < 576) {
      // Extra small devices (phones)
      this.slidesToShow = 1;
    } else if (width < 768) {
      // Small devices (tablets)
      this.slidesToShow = 2;
    } else if (width < 992) {
      // Medium devices (desktops)
      this.slidesToShow = 3;
    } else {
      // Large devices (large desktops)
      this.slidesToShow = 4;
    }
    this.changeDetectorRef.markForCheck();
  }

  constructor(
    private playlistsService: PlaylistsService,
    private spotifyService: SpotifyService,
    private matDialog: MatDialog,
    private playlistEventService: PlaylistEventService,
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private spotifySdkService: SpotifySdkService,
    private appleMusicService: AppleMusicService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.updateSlidesToShow(window.innerWidth);
  }
  ngOnInit(): void {
    this.loadPlaylists();

    this.playlistEventService.playlistEvent$.subscribe({
      next: (playlistEvent: PlaylistEvent) => {
        this.snackBar.open(playlistEvent.message, 'Close', {
          duration: 5000,
        });
        if (
          playlistEvent.source === SourceType.SPOTIFY &&
          this.source === SourceType.SPOTIFY
        ) {
          this.getSpotifyPlaylists();
        }
        if (
          playlistEvent.source === SourceType.SYNCIFY &&
          this.source === SourceType.SYNCIFY
        ) {
          this.getSyncifyPlaylists();
        }
      },
    });

    this.dashboardService.dashboardRefreshSubject$.subscribe({
      next: (val) => {
        this.refreshPlaylists();
      },
    });
  }

  loadPlaylists() {
    if (this.source === SourceType.SPOTIFY) {
      this.getSpotifyPlaylists();
    } else if (this.source === SourceType.SYNCIFY) {
      this.getSyncifyPlaylists();
    } else if (this.source === SourceType.APPLE_MUSIC) {
      this.getAppleMusicPlaylists();
    }
  }

  getSpotifyPlaylists() {
    this.playlistsLoading = true;
    this.spotifySdkService.sdkReady$
      .pipe(
        switchMap((ready) => {
          if (ready) {
            return this.spotifySdkService.getPlaylistsOfCurrentUser();
          } else {
            return throwError(() => {
              console.log('sdk not init yet');
            });
          }
        })
      )
      .pipe(map((response) => response.items))
      .subscribe({
        next: (playlists: SimplifiedPlaylist[]) => {
          for (let playlist of playlists) {
            let imageUrl: string;
            if (playlist.images && playlist.images.length > 0) {
              imageUrl = playlist.images[0].url;
            } else {
              imageUrl = '';
            }

            this.playlists.push({
              name: playlist.name,
              id: playlist.id,
              source: SourceType.SPOTIFY,
              imageUrl: imageUrl,
              href: playlist.external_urls.spotify,
              songCount: (playlist.tracks as TrackReference).total,
            });
          }

          this.playlistsLoading = false;
        },
        error: () => {
          this.playlistsLoading = false;
          this.playlistsLoadError = true;
          this.playlists = [];
        },
      });
  }

  getAppleMusicPlaylists() {
    this.playlistsLoading = true;
    this.appleMusicService.getPlaylistsOfCurrentUser().subscribe({
      next: (obj) => {
        console.log(obj);
      },
      error: () => {},
    });
  }

  getSyncifyPlaylists() {
    this.playlistsLoading = true;
    this.playlistsService.fetchAllPlaylistsForUser().subscribe({
      next: (res) => {
        this.playlistsLoading = false;
        this.playlists = res;
      },
      error: (err) => {
        this.playlistsLoading = false;
        this.playlistsLoadError = true;
        this.playlists = [];
      },
    });
  }

  openCreatePlaylistDialog(sourceType: SourceType) {
    let dialogRef = this.matDialog.open(CreatePlaylistDialogComponent, {
      minHeight: '400px',
      minWidth: '500px',
      data: sourceType,
    });

    dialogRef.afterClosed().subscribe({
      next: (closeValue) => {
        if (closeValue === true) {
          if (this.source === SourceType.SYNCIFY) {
            //this.getSyncifyPlaylists();
            this.playlistEventService.playlistEvent$.next({
              message: 'Syncify Playlist Created Successfully',
              source: SourceType.SYNCIFY,
            });
          }

          if (this.source === SourceType.SPOTIFY) {
            //this.getSpotifyPlaylists();
            this.playlistEventService.playlistEvent$.next({
              message: 'Spotify Playlist Created Successfully',
              source: SourceType.SPOTIFY,
            });
          }
        }
      },
    });
  }

  refreshPlaylists() {
    this.playlistsLoading = true;
    this.loadPlaylists();
  }

  slickInit(e: any) {}

  get SourceType() {
    return SourceType;
  }
} */
