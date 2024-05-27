import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { SongService } from '../../services/song.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public routeLinks = [
    { link: 'dashboard', name: 'Home', icon: 'home' },
    { link: 'playlists', name: 'My Playlists', icon: 'library_music' },
    { link: 'sync', name: 'Sync', icon: 'sync_alt' },
  ];
  public isExpanded = false;

  constructor(
    private authService: AuthService,
    private songService: SongService,
    private router: Router
  ) {}

  hitapi() {
    return this.songService.findSongByName('name').subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/login']);
      },
    });
  }
}
