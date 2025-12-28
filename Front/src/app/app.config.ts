import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';

import { routes } from './app.routes';
import { FavoritesState } from './shared/states/favorites.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(
      [FavoritesState],
      withNgxsStoragePlugin({
        keys: ['favorites'], // Persist only favorites state
      })
    ),
  ],
};
