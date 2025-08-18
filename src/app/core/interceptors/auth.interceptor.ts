// src/app/core/interceptors/auth.interceptor.ts
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@app/features/auth/store/auth.store';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor to add the Authorization header with Bearer token
 * to outgoing HTTP requests.
 * It also handles 401 Unauthorized errors by clearing the token and user state,
 * redirecting to the login page.
 * This is used for the Laravel API (Sanctum) authentication flow.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const token = store.state().token;

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err?.status === 401) {
        // limpiar estado y redirigir al login
        localStorage.removeItem('access_token');
        store.dispatch({ type: '[Auth] Set Token', token: null } as any);
        store.dispatch({ type: '[Auth] Set User', user: null } as any);
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
