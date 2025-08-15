// src/app/core/models/auth.model.ts
/**
 * Structures for auth endpoints.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
}
export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'Admin' | 'User';
}
