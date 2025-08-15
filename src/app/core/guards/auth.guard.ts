// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * Blocks routes if no auth token present.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
export const authGuard: CanActivateFn = () => {
  const token = inject(TokenService).get();
  if (!token) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
};
