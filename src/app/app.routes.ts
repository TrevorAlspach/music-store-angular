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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'playlists', component: PlaylistsComponent },
      { path: 'sync', component: SyncPlaylistsComponent },
      { path: 'spotify-auth', component: SpotifyAuthComponent }
    ],
  },
  { path: '**', component: LoginComponent },
];
