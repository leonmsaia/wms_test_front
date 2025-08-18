// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';

const KEY = 'access_token';

/**
 * Stores and retrieves the API access token.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable({ providedIn: 'root' })
export class TokenService {
  get(): string | null {
    return localStorage.getItem(KEY);
  }
  set(token: string): void {
    localStorage.setItem(KEY, token);
  }
  clear(): void {
    localStorage.removeItem(KEY);
  }
  get isAuthenticated(): boolean {
    return !!this.get();
  }
}
