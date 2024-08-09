import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { authGuard } from './guards/auth.guard';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { SyncPlaylistsComponent } from './components/sync-playlists/sync-playlists.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SpotifyAuthComponent } from './components/auth/spotify-auth/spotify-auth.component';
import { PlaylistDetailsComponent } from './components/playlists/playlist-details/playlist-details.component';
import { TransferPlaylistsComponent } from './components/transfer-playlists/transfer-playlists.component';
import { AccountComponent } from './components/account/account.component';
import { LoginAuth0Component } from './components/auth/login-auth0/login-auth0.component';
import { authGuardFn } from '@auth0/auth0-angular';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuardFn],
    children: [
      { path: 'auth', component: LoginAuth0Component },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'account', component: AccountComponent },
      { path: 'playlists', component: PlaylistsComponent },
      { path: 'sync', component: SyncPlaylistsComponent },
      { path: 'transfer', component: TransferPlaylistsComponent },
      { path: 'spotify-auth', component: SpotifyAuthComponent },
      {
        path: 'playlist-details/:source/:id',
        component: PlaylistDetailsComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'home/dashboard' },
];
