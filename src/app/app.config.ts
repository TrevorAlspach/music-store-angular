import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  /* providers: [provideRouter(routes, withComponentInputBinding()), provideAnimationsAsync(), provideHttpClient(withInterceptors([authInterceptor]))] */
  providers: [
    provideAuth0({
      domain: 'dev-5icodle12xbi8dtf.us.auth0.com',
      clientId: 'hKjneu0AYL1q087Bxlxg1AEX6tUR5KEI',
      authorizationParams: {
        redirect_uri: /* window.location.origin */ 'http://localhost:4200/auth',
        audience: 'http://localhost:8080/',
      },
    }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(/* withInterceptors([authInterceptor] )*/),
  ],
};
