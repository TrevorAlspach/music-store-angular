import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  /* providers: [provideRouter(routes, withComponentInputBinding()), provideAnimationsAsync(), provideHttpClient(withInterceptors([authInterceptor]))] */
  providers: [
    provideAuth0({
      domain: 'dev-5icodle12xbi8dtf.us.auth0.com',
      clientId: 'hKjneu0AYL1q087Bxlxg1AEX6tUR5KEI',

      authorizationParams: {
        redirect_uri: `${window.location.origin}/auth`,

        // Request this audience at user authentication time
        audience: 'http://localhost:8080/',

        // Request this scope at user authentication time
        scope: 'admin',
      },
      //useRefreshTokens: true,

      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://dev-5icodle12xbi8dtf.us.auth0.com/api/v2/' (note the asterisk)
            uri: 'http://localhost:8080/*',
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: 'http://localhost:8080/',

                // The attached token should have these scopes
                scope: 'admin',
              },
            },
          },
        ],
      },
    }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
  ],
};
