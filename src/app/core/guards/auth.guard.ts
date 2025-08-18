// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@app/features/auth/store/auth.store';


/**
 * Auth Guard to protect routes that require authentication.
 * It checks if the user has a valid token in the AuthStore.
 * If not, it redirects to the login page.
 * This is used for the Laravel API (Sanctum) authentication flow.
 *  
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */

export const authGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  if (store.state().token) return true;
  router.navigate(['/login']);
  return false;
};