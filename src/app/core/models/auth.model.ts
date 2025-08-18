// src/app/core/models/auth.model.ts
/**
 * Structures for auth endpoints.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */

export type Rol = 'Admin' | 'User';

export interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: Rol;
}