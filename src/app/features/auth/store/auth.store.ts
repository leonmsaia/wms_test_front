// src/app/features/auth/store/auth.store.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { AuthApi } from '@app/core/services/auth.api';
import { AuthUser, LoginRequest, RegisterRequest } from '../../../core/models/auth.model';

/**
* AuthStore manages authentication state including user info, token, and status.
* It provides methods to login, register, fetch user info, and logout.
* It uses an internal BehaviorSubject to track state changes and expose them as an observable.
* Actions are dispatched to update the state based on API responses.
* It handles errors gracefully, resetting the token and user on failure.
* It also persists the token in localStorage for session management.
* State structure:
* {
*  user: AuthUser | null; // Current authenticated user
*  token: string | null; // JWT token for authenticated requests
*  status: 'idle' | 'loading' | 'ready' | 'error'; // Current loading status
*  error: string | null; // Error message if any
* }
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : null,
  status: 'idle',
  error: null,
};

export const authLogin    = (payload: LoginRequest)    => ({ type: '[Auth] Login'    as const, payload });
export const authRegister = (payload: RegisterRequest) => ({ type: '[Auth] Register' as const, payload });
export const authMe       = ()                        => ({ type: '[Auth] Me'       as const });
export const authLogout   = ()                        => ({ type: '[Auth] Logout'   as const });

export type AuthActions =
  | ReturnType<typeof authLogin>
  | ReturnType<typeof authRegister>
  | ReturnType<typeof authMe>
  | ReturnType<typeof authLogout>
  | { type: '[Auth] Set Token'; token: string | null }
  | { type: '[Auth] Set User';  user: AuthUser | null }
  | { type: '[Auth] Set Busy' }
  | { type: '[Auth] Set Error'; error: string };

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private api = inject(AuthApi);
  private _state$ = new BehaviorSubject<AuthState>({ ...initialState });

  state(): AuthState {
    return this._state$.getValue();
  }

  select$() {
    return this._state$.asObservable();
  }

  private set(partial: Partial<AuthState>) {
    this._state$.next({ ...this._state$.getValue(), ...partial });
  }

  dispatch(action: AuthActions) {
    switch (action.type) {
      case '[Auth] Set Busy':
        this.set({ status: 'loading', error: null });
        return;

      case '[Auth] Set Token':
        if (action.token) {
          localStorage.setItem('access_token', action.token);
        } else {
          localStorage.removeItem('access_token');
        }
        this.set({ token: action.token });
        return;

      case '[Auth] Set User':
        this.set({ user: action.user, status: 'ready', error: null });
        return;

      case '[Auth] Set Error':
        this.set({ status: 'error', error: action.error });
        return;

      case '[Auth] Login': {
        this.set({ status: 'loading', error: null });
        of(null).pipe(
          switchMap(() => this.api.login(action.payload)),
          tap(res => this.dispatch({ type: '[Auth] Set Token', token: res.access_token })),
          switchMap(() => this.api.me()),
          tap(user => this.dispatch({ type: '[Auth] Set User', user })),
          catchError((err) => {
            this.dispatch({ type: '[Auth] Set Token', token: null });
            this.dispatch({ type: '[Auth] Set Error', error: err?.error?.message ?? 'Login failed' });
            return of(null);
          })
        ).subscribe();
        return;
      }

      case '[Auth] Register': {
        this.set({ status: 'loading', error: null });
        of(null).pipe(
          switchMap(() => this.api.register(action.payload)),
          tap(() => this.set({ status: 'idle' })),
          catchError((err) => {
            this.dispatch({ type: '[Auth] Set Error', error: err?.error?.message ?? 'Register failed' });
            return of(null);
          })
        ).subscribe();
        return;
      }

      case '[Auth] Me': {
        this.set({ status: 'loading', error: null });
        of(null).pipe(
          switchMap(() => this.api.me()),
          tap(user => this.dispatch({ type: '[Auth] Set User', user })),
          catchError(() => {
            this.dispatch({ type: '[Auth] Set Token', token: null });
            this.dispatch({ type: '[Auth] Set Error', error: 'Session expired' });
            return of(null);
          })
        ).subscribe();
        return;
      }

      case '[Auth] Logout': {
        of(null).pipe(
          switchMap(() => this.api.logout()),
          tap(() => {
            this.dispatch({ type: '[Auth] Set Token', token: null });
            this.dispatch({ type: '[Auth] Set User', user: null });
          }),
          catchError(() => {

            this.dispatch({ type: '[Auth] Set Token', token: null });
            this.dispatch({ type: '[Auth] Set User', user: null });
            return of(null);
          })
        ).subscribe();
        return;
      }
    }
  }
}
