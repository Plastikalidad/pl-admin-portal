import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAuth0({
    domain: 'dev-9wq4ue47.us.auth0.com',
    clientId: 'z0lcVEt9PCXLU1QQOa0GQuJRpUl5KNyp',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })]
};
