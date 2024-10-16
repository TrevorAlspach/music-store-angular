import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { AccountComponent } from './components/account/account.component';
import { LoginAuth0Component } from './components/auth/login-auth0/login-auth0.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SpotifyAuthComponent } from './components/auth/spotify-auth/spotify-auth.component';
import { TidalAuthComponent } from './components/auth/tidal-auth/tidal-auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { MyPlaylistsComponent } from './components/playlists/my-playlists/my-playlists.component';
import { PlaylistDetailsComponent } from './components/playlists/playlist-details/playlist-details.component';
import { SyncPlaylistsComponent } from './components/sync-playlists/sync-playlists.component';
import { TransferPlaylistsComponent } from './components/transfer-playlists/transfer-playlists.component';

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
      { path: 'playlists', component: MyPlaylistsComponent },
      { path: 'sync', component: SyncPlaylistsComponent },
      { path: 'transfer', component: TransferPlaylistsComponent },
      { path: 'spotify-auth', component: SpotifyAuthComponent },
      { path: 'tidal-auth', component: TidalAuthComponent },
      {
        path: 'playlist-details/:source/:id',
        component: PlaylistDetailsComponent,
      },
    ],
  },

  { path: '**', redirectTo: 'home/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
