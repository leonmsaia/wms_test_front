// src/app/core/services/users.api.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type Rol = 'Admin' | 'User';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  created_at?: string;
  updated_at?: string;
}

export interface Paginated<T> {
  data: T[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

/**
 * Users API wrapper (Laravel endpoints)
 *
 * Endpoints:
 *  - GET    /api/usuarios?role=&q=&page=&per_page=
 *  - POST   /api/usuarios
 *  - PUT    /api/usuarios/:id
 *  - DELETE /api/usuarios/:id
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly base = `${environment.apiBaseUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  list(opts: { role?: Rol; q?: string; page?: number; per_page?: number } = {}) {
    let params = new HttpParams();
    if (opts.role) params = params.set('role', opts.role);
    if (opts.q) params = params.set('q', opts.q);
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.per_page) params = params.set('per_page', String(opts.per_page));

    return this.http.get<Paginated<User>>(this.base, { params });
  }

  create(payload: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password?: string }) {
    return this.http.post<User>(this.base, payload);
  }

  update(id: number, payload: Partial<Omit<User, 'id'>>) {
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
