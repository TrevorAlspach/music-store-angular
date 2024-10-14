import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { PlaylistsService } from '../../../services/syncify/playlists.service';
import { SpotifyService } from '../../../services/external-services/spotify.service';
import { CreatePlaylistDialogComponent } from '../../playlists/create-playlist-dialog/create-playlist-dialog.component';
import { ConnectedService } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { connectableServices, SourceType } from '../../../models/music.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpotifySdkService } from '../../../services/external-services/spotify-sdk.service';
import { TidalSdkService } from '../../../services/external-services/tidal-sdk.service';
import { AppleMusicService } from '../../../services/external-services/apple-music.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-connect-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './connect-service-dialog.component.html',
  styleUrl: './connect-service-dialog.component.scss',
})
export class ConnectServiceDialogComponent implements OnInit {
  alreadyConnectedServices: ConnectedService[];
  connectableServices = connectableServices;

  loading: boolean = false;

  constructor(
    private spotifySdkService: SpotifySdkService,
    private tidalSdkService: TidalSdkService,
    private playlistsService: PlaylistsService,
    public dialogRef: MatDialogRef<CreatePlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private appleMusicService: AppleMusicService
  ) {
    this.alreadyConnectedServices = data;
  }

  ngOnInit(): void {
    for (let service of connectableServices) {
      if (
        this.alreadyConnectedServices.find((connectedService) => {
          return connectedService.externalService === service.sourceType;
        })
      ) {
        service.alreadyConnected = true;
      }
    }
  }

  sourceSelected(sourceType: SourceType) {
    console.log('selected ' + sourceType);

    if (sourceType === SourceType.SPOTIFY) {
      this.spotifySdkService.authenticate();
    }

    if (sourceType === SourceType.TIDAL) {
      this.tidalSdkService.authorizeUser();
    }

    if (sourceType === SourceType.APPLE_MUSIC) {
      console.log('in here');
      this.loading = true;
      this.appleMusicService.musicKitInit$
        .pipe(switchMap(() => this.appleMusicService.startAuth()))
        .subscribe({
          next: (expirationTimestamp) => {
            this.loading = false;
            console.log('Authorized user with Apple Music');
          },
          error: () => {},
        });

      this.appleMusicService.init();
    }
  }
}
