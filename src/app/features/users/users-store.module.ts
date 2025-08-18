// src/app/features/users/users-store.module.ts
import { NgModule } from '@angular/core';
import { StoreModule, EffectsModule } from 'mini-rx-store-ng';
import { usersReducer } from './store/users.reducer';
import { UsersEffects } from './store/users.effects';

/**
 * Users store feature registration (MiniRx + Angular bridge).
 * Registers the users feature state and effects.
 * This module integrates the users feature into the MiniRx store.
 * It includes the users reducer and effects for handling user-related actions.
 * This allows the application to manage user data,
 * including fetching, creating, updating, and deleting users.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@NgModule({
  imports: [
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.register([UsersEffects]),
  ],
})
export class UsersStoreModule {}
