import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { ScriptService } from './services/util/scripts/script.service';
import { WindowRefService } from './services/util/window-ref.service';
import { DocumentRefService } from './services/util/document-ref.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,

      authorizationParams: {
        redirect_uri: environment.auth0.redirect_uri,

        // Request this audience at user authentication time
        audience: environment.auth0.audience,

        // Request this scope at user authentication time
        scope: environment.auth0.scope,
      },
      //useRefreshTokens: true,

      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://dev-5icodle12xbi8dtf.us.auth0.com/api/v2/' (note the asterisk)
            uri: environment.auth0.interceptor.uri,
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: environment.auth0.audience,

                // The attached token should have these scopes
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
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    ScriptService,
    WindowRefService,
    DocumentRefService,
  ],
};
