// src/app/store/app-store.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from 'mini-rx-store-ng';

/**
 * Root MiniRx store module configuration.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@NgModule({
  imports: [
    StoreModule.forRoot({
      reducers: {}, // features se registran aparte
      extensions: [], // opcional: LoggerExtension, Devtools, etc.
      metaReducers: [],
    }),
  ],
})
export class AppStoreModule {}
