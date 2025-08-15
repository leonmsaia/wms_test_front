// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';

/**
 * Simple token storage (localStorage) for Bearer tokens.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable({ providedIn: 'root' })
export class TokenService {
  private key = 'access_token';
  get(): string | null { return localStorage.getItem(this.key); }
  set(token: string) { localStorage.setItem(this.key, token); }
  clear() { localStorage.removeItem(this.key); }
}
