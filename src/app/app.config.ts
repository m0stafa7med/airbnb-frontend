import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {authHttpInterceptorFn, provideAuth0} from "@auth0/auth0-angular";
import {environment} from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authHttpInterceptorFn]),
      withInterceptorsFromDi(),
    ),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0.audience,
      },
      httpInterceptor: {
        allowedList: [
          {
            uriMatcher: (uri) => uri.includes('/api/'),
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
              },
            },
          },
        ],
      },
    }),
    provideRouter(routes),
  ],
};
