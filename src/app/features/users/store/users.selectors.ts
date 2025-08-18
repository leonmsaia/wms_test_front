// src/app/features/users/store/users.selectors.ts
import { UsersState } from './users.reducer';

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
