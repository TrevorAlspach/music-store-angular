import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlaylistLargeComponent } from '../playlists/playlist-large/playlist-large.component';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AuthService } from '../../services/syncify/auth.service';
import { ConnectedService } from '../../models/user.model';
import { SourceType } from '../../models/music.model';
import { ServiceComponent } from './service/service.component';
import { MatDialog } from '@angular/material/dialog';
import { ConnectServiceDialogComponent } from './connect-service-dialog/connect-service-dialog.component';

@Component({
  selector: 'app-services',
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
    ServiceComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  constructor(private authService: AuthService, private matDialog: MatDialog) {}

  readonly addExternalServiceListItem = {
    externalService: SourceType.NONE,
    imgPath: '',
  };

  connectedServices: ConnectedService[] = [
    { externalService: SourceType.SYNCIFY, imgPath: 'assets/syncify.png' },
  ];

  ngOnInit(): void {
    this.authService
      .connectedServices()
      .subscribe((connectedServices: ConnectedService[]) => {
        for (let service of connectedServices) {
          this.connectedServices.push({
            ...service,
            imgPath: this.getImgPathOfExternalService(service),
          });
        }
      });
  }

  getImgPathOfExternalService(connectedService: ConnectedService) {
    console.log(connectedService);
    if (connectedService.externalService === SourceType.SPOTIFY) {
      return 'assets/Spotify_Primary_Logo_RGB_Green.png';
    }

    if (connectedService.externalService === SourceType.SYNCIFY) {
      return 'assets/syncify.png';
    }

    if (connectedService.externalService === SourceType.APPLE_MUSIC) {
      return 'assets/Apple_Music_Icon_RGB_sm_073120.svg';
    }

    return 'assets/defaultAlbum.jpg';
  }

  openConnectDialog() {
    console.log('connect dialog');
    let dialogRef = this.matDialog.open(ConnectServiceDialogComponent, {
      minHeight: '400px',
      minWidth: '500px',
      data: this.connectedServices,
    });

    dialogRef.afterClosed().subscribe({
      next: () => {},
    });
  }
}
