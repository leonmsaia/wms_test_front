// src/app/core/services/auth.api.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginPayload, LoginResponse, RegisterPayload } from '../models/auth.model';

/**
 * Auth API client for Laravel Sanctum endpoints.
 *
 * Endpoints:
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 *  - POST /api/auth/logout
 *  - GET  /api/auth/me
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private base = environment.apiBase + '/auth';

  register(payload: RegisterPayload) {
    return this.http.post(`${this.base}/register`, payload);
  }

  login(payload: LoginPayload) {
    return this.http.post<LoginResponse>(`${this.base}/login`, payload);
  }

  me() {
    return this.http.get(`${this.base}/me`);
  }

  logout() {
    return this.http.post(`${this.base}/logout`, {});
  }
}
