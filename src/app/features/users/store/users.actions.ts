// src/app/features/users/store/users.actions.ts
/**
 * Users action types and action creators.
 * This file defines the actions related to user management,
 * including fetching, creating, modifying, and deleting users.
 * It also includes actions for setting filters and pagination.
 * Action types are defined as an enum for type safety.
 * Action creators return objects with a type and optional payload.
 * 
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
export enum UsersActionTypes {
  obtenerColeccion = '[Users] Obtener Coleccion',
  obtenerColeccionSuccess = '[Users] Obtener Coleccion Success',
  obtenerColeccionFail = '[Users] Obtener Coleccion Fail',

  crear = '[Users] Crear',
  crearSuccess = '[Users] Crear Success',
  crearFail = '[Users] Crear Fail',

  modificar = '[Users] Modificar',
  modificarSuccess = '[Users] Modificar Success',
  modificarFail = '[Users] Modificar Fail',

  eliminar = '[Users] Eliminar',
  eliminarSuccess = '[Users] Eliminar Success',
  eliminarFail = '[Users] Eliminar Fail',

  setFilters = '[Users] Set Filters',
  setPage = '[Users] Set Page',
}

export interface UsersFilters {
  role?: 'Admin' | 'User' | '';
  q?: string;
}

export const UsersActions = {
  obtenerColeccion: (payload?: void) => ({ type: UsersActionTypes.obtenerColeccion }),
  obtenerColeccionSuccess: (payload: { data: any[]; meta?: any }) => ({ type: UsersActionTypes.obtenerColeccionSuccess, payload }),
  obtenerColeccionFail: (error: unknown) => ({ type: UsersActionTypes.obtenerColeccionFail, error }),

  crear: (payload: any) => ({ type: UsersActionTypes.crear, payload }),
  crearSuccess: (payload: any) => ({ type: UsersActionTypes.crearSuccess, payload }),
  crearFail: (error: unknown) => ({ type: UsersActionTypes.crearFail, error }),

  modificar: (payload: { id: number; changes: any }) => ({ type: UsersActionTypes.modificar, payload }),
  modificarSuccess: (payload: any) => ({ type: UsersActionTypes.modificarSuccess, payload }),
  modificarFail: (error: unknown) => ({ type: UsersActionTypes.modificarFail, error }),

  eliminar: (payload: { id: number }) => ({ type: UsersActionTypes.eliminar, payload }),
  eliminarSuccess: (payload: { id: number }) => ({ type: UsersActionTypes.eliminarSuccess, payload }),
  eliminarFail: (error: unknown) => ({ type: UsersActionTypes.eliminarFail, error }),

  setFilters: (payload: UsersFilters) => ({ type: UsersActionTypes.setFilters, payload }),
  setPage: (payload: { page: number }) => ({ type: UsersActionTypes.setPage, payload }),
};
