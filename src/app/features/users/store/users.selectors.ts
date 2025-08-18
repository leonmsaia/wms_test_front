// src/app/features/users/store/users.selectors.ts
import { UsersState } from './users.reducer';

/**
* Selectors for the Users feature state.
* These selectors are used to access specific pieces of the Users state
* from the global application state.
* * @module UsersSelectors
* * This module provides functions to select various properties from the Users state,
* such as items, loading status, error messages, pagination details, and filters.
* * @example
* import { selectItems, selectLoading } from './users.selectors';
* * const items = selectItems(state);
* * @function selectUsersState
* @param {any} root - The root state of the application.
* @return {UsersState} The Users state from the root state.
* * @function selectItems
* @param {any} root - The root state of the application.
* @return {Array} The list of user items from the Users state.
* * @function selectLoading
* @param {any} root - The root state of the application.
* @return {boolean} The loading status from the Users state.
* * @function selectError
* @param {any} root - The root state of the application.
* @return {string|null} The error message from the Users state, or null if no error.
* * @function selectPage
* @param {any} root - The root state of the application.
* @return {number} The current page number from the Users state.
* * @function selectPerPage
* @param {any} root - The root state of the application.
* @return {number} The number of items per page from the Users state.
* * @function selectTotal
* @param {any} root - The root state of the application.
* @return {number} The total number of items from the Users state, defaulting to 0 if not set.
* * @function selectFilters
* @param {any} root - The root state of the application.
* @return {Object} The filters applied to the Users state.
* * @function selectLastPage
* @param {any} root - The root state of the application.
* @return {number} The last page number based on total items and items per page,
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

export const selectUsersState = (root: any): UsersState => root.users;
export const selectItems       = (root: any) => selectUsersState(root).items;
export const selectLoading     = (root: any) => selectUsersState(root).loading;
export const selectError       = (root: any) => selectUsersState(root).error;
export const selectPage        = (root: any) => selectUsersState(root).page;
export const selectPerPage     = (root: any) => selectUsersState(root).per_page;
export const selectTotal       = (root: any) => selectUsersState(root).total ?? 0;
export const selectFilters     = (root: any) => selectUsersState(root).filters;
export const selectLastPage    = (root: any) => {
  const s = selectUsersState(root);
  if (!s.total || !s.per_page) return 1;
  return Math.max(1, Math.ceil(s.total / s.per_page));
};
