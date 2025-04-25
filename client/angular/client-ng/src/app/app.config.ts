import { ApplicationConfig } from '@angular/core';

import { appRoutes as routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Token } from './interceptors/token';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    provideHttpClient(), provideHttpClient(withInterceptors([Token])), provideAnimationsAsync()
    ]
};
