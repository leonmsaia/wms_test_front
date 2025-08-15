// src/app/features/users/store/users.reducer.ts
import { UsersActionTypes } from './users.actions';
import { User } from '../../../core/models/user.model';

/**
 * Users feature state and reducer.
 *
 * Holds collection, pagination, filters, loading and error flags.
 * Initial state is empty collection with loading false and no errors.
 * Actions include fetching, creating, modifying, deleting users,
 * and setting filters and pagination.
 * Reducer handles actions to update state accordingly.
 * Initial state is defined with sensible defaults.
 * State includes:
 * - items: array of User entities
 * - loading: boolean flag for loading state
 * - error: optional string for error messages
 * - page: current page number (1-based)
 * - per_page: number of items per page (fixed at 10)
 * - total: optional total count of items (for pagination)
 * - filters: object with optional role and search query
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
export interface UsersState {
  items: User[];
  loading: boolean;
  error?: string | null;
  page: number;         // 1-based
  per_page: number;     // fixed at 10
  total?: number;       // optional
  filters: { role?: 'Admin' | 'User' | ''; q?: string };
}

export const initialUsersState: UsersState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  per_page: 10,
  total: 0,
  filters: { role: '', q: '' },
};

export function usersReducer(
  state: UsersState = initialUsersState,
  action: any
): UsersState {
  switch (action.type) {
    case UsersActionTypes.setFilters:
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };

    case UsersActionTypes.setPage:
      return { ...state, page: action.payload.page };

    case UsersActionTypes.obtenerColeccion:
    case UsersActionTypes.crear:
    case UsersActionTypes.modificar:
    case UsersActionTypes.eliminar:
      return { ...state, loading: true, error: null };

    case UsersActionTypes.obtenerColeccionSuccess:
      return {
        ...state,
        loading: false,
        items: action.payload.data,
        total: action.payload.meta?.total ?? action.payload.data.length,
      };

    case UsersActionTypes.crearSuccess:
      return {
        ...state,
        loading: false,
      };

    case UsersActionTypes.modificarSuccess:
    case UsersActionTypes.eliminarSuccess:
      return { ...state, loading: false };

    case UsersActionTypes.obtenerColeccionFail:
    case UsersActionTypes.crearFail:
    case UsersActionTypes.modificarFail:
    case UsersActionTypes.eliminarFail:
      return { ...state, loading: false, error: String(action.error ?? 'Unknown error') };

    default:
      return state;
  }
}
