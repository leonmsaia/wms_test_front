// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { AppStoreModule } from './app/store/app-store.module';
import { UsersStoreModule } from './app/features/users/users-store.module';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers!,
    importProvidersFrom(AppStoreModule, UsersStoreModule),
  ],
});
