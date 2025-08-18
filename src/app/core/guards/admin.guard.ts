// src/app/core/guards/admin.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@app/features/auth/store/auth.store';

/**
 * Admin Guard to protect routes that require admin privileges.
 * It checks if the authenticated user has the 'Admin' role in the AuthStore.
 * If not, it redirects to the home page.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */

export const adminGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const user = store.state().user;
  if (user?.rol === 'Admin') return true;
  router.navigate(['/']);
  return false;
};
