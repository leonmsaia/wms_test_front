// src/app/core/services/auth.api.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, body);
  }

  register(body: RegisterRequest) {
    return this.http.post<{ message: string; user: AuthUser }>(`${this.base}/auth/register`, body);
  }

  me() {
    return this.http.get<AuthUser>(`${this.base}/auth/me`);
  }

  logout() {
    return this.http.post<{ message: string }>(`${this.base}/auth/logout`, {});
  }
}
