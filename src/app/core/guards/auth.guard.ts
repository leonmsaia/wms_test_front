// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * Route guard that requires authentication.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
export const authGuard: CanActivateFn = () => {
  const token = inject(TokenService);
  const router = inject(Router);
  if (token.isAuthenticated) return true;
  router.navigateByUrl('/login');
  return false;
};