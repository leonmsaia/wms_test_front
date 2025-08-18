// src/app/core/models/user.model.ts
/**
 * Represents a user entity from the backend.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'Admin' | 'User';
  created_at?: string;
  updated_at?: string;
}
