/* import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyPlaylistsComponent } from './components/playlists/my-playlists/my-playlists.component';
import { SyncPlaylistsComponent } from './components/sync-playlists/sync-playlists.component';
import { TransferPlaylistsComponent } from './components/transfer-playlists/transfer-playlists.component';
import { AccountComponent } from './components/account/account.component';
import { SpotifyAuthComponent } from './components/auth/spotify-auth/spotify-auth.component';
import { TidalAuthComponent } from './components/auth/tidal-auth/tidal-auth.component';
import { PlaylistDetailsComponent } from './components/playlists/playlist-details/playlist-details.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { ScriptService } from './services/util/scripts/script.service';
import { WindowRefService } from './services/util/window-ref.service';
import { DocumentRefService } from './services/util/document-ref.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent, // AppComponent is no longer standalone
  ],
  imports: [
    LoginComponent,
    SignupComponent,
    HomeComponent,
    DashboardComponent,
    MyPlaylistsComponent,
    SyncPlaylistsComponent,
    TransferPlaylistsComponent,
    AccountComponent,
    SpotifyAuthComponent,
    TidalAuthComponent,
    PlaylistDetailsComponent,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // Import animations module
  ],
  providers: [
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.redirect_uri,
        audience: environment.auth0.audience,
        scope: environment.auth0.scope,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: environment.auth0.interceptor.uri,
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: environment.auth0.scope,
              },
            },
          },
          {
            uri: environment.auth0.interceptor.auth0Uri,
          },
        ],
      },
      skipRedirectCallback: window.location.pathname === '/home/tidal-auth',
    }),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    ScriptService,
    WindowRefService,
    DocumentRefService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
 */
