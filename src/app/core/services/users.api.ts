// src/app/core/services/users.api.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

/**
 * Users API client matching Laravel endpoints with filters & pagination.
 *
 * Endpoints:
 *  - GET    /api/usuarios?role=&q=&page=&per_page=
 *  - POST   /api/usuarios
 *  - PUT    /api/usuarios/{id}
 *  - DELETE /api/usuarios/{id}
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable({ providedIn: 'root' })
export class UsersApi {
  private http = inject(HttpClient);
  private base = environment.apiBase + '/usuarios';

  list(opts: { role?: string; q?: string; page?: number; per_page?: number }) {
    let params = new HttpParams();
    if (opts.role) params = params.set('role', opts.role);
    if (opts.q) params = params.set('q', opts.q);
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.per_page) params = params.set('per_page', String(opts.per_page));
    return this.http.get<{ data: User[]; meta?: any }>(`${this.base}`, { params });
  }

  create(payload: Partial<User> & { password?: string }) {
    return this.http.post<User>(`${this.base}`, payload);
  }

  update(id: number, payload: Partial<User> & { password?: string }) {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
