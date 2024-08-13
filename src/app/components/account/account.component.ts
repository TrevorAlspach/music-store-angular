import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
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
    MatCardModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  constructor(private authService: AuthService, private router: Router, private auth0Service: Auth0Service) {}

  public routeLinks = [
    {
      link: 'disconnect-external-sources',
      name: 'Disconnect external sources',
      icon: 'home',
    },
    { link: 'terms', name: 'Terms Of Service', icon: 'sync_alt' },
    { link: 'tbd', name: 'TBD', icon: 'trending_flat' },
    { link: 'delete-account', name: 'Delete Account', icon: 'settings' },
  ];

  logout() {
    this.authService.logout();
  }
}
