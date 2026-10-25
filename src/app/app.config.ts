import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Hash URLs (#/film/1) like the original ngRoute app, so it works on any static host.
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    provideHttpClient(),
  ],
};
