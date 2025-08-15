// src/app/core/services/auth.api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type LoginDto = { email: string; password: string };
type LoginRes = { access_token: string; token_type: 'Bearer' };
type RegisterDto = { nombre: string; apellido: string; email: string; password: string; rol: 'Admin'|'User' };

/**
 * Auth endpoints wrapper for the Laravel API (Sanctum).
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private base = `${environment.apiBaseUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(dto: LoginDto) {
    return this.http.post<LoginRes>(`${this.base}/login`, dto);
  }
  register(dto: RegisterDto) {
    return this.http.post(`${this.base}/register`, dto);
  }
  me() {
    return this.http.get(`${this.base}/me`);
  }
  logout() {
    return this.http.post(`${this.base}/logout`, {});
  }
}
