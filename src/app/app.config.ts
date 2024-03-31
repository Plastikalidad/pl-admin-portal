import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    provideRouter(routes), provideAuth0({
      domain: 'dev-9wq4ue47.us.auth0.com',
      clientId: 'z0lcVEt9PCXLU1QQOa0GQuJRpUl5KNyp',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideFunctions(() => getFunctions()),
      provideMessaging(() => getMessaging()),
      providePerformance(() => getPerformance()),
      provideStorage(() => getStorage()),
    ]), provideAnimationsAsync('animations')

  ]
};
