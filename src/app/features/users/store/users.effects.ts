// src/app/features/users/store/users.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from 'mini-rx-store';
import { UsersActionTypes, UsersActions } from './users.actions';
import { UsersApi } from '../../../core/services/users.api';
import { mapResponse } from 'mini-rx-store';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { Store } from 'mini-rx-store';
import { UsersState } from './users.reducer';

/**
 * Users effects: side-effects wrapper for API calls.
 * Handles loading, creating, updating, and deleting users.
 * Uses UsersApi to interact with backend endpoints.
 * Effects are triggered by actions dispatched from components or services.
 * Effects listen for specific action types and perform the corresponding API calls.
 * On success, they dispatch success actions to update the state.
 * On failure, they dispatch fail actions with error details.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private api = inject(UsersApi);
  private store = inject<Store>(Store as any);

  load$ = createEffect(
    this.actions$.pipe(
      ofType(UsersActionTypes.obtenerColeccion, UsersActionTypes.setFilters, UsersActionTypes.setPage),
      withLatestFrom(this.store.select((s: any) => s.users as UsersState)),
      mergeMap(([, state]) =>
        this.api.list({
          role: state.filters.role || undefined,
          q: state.filters.q || undefined,
          page: state.page,
          per_page: state.per_page,
        }).pipe(
          mapResponse(
            (res) => UsersActions.obtenerColeccionSuccess(res),
            (err) => UsersActions.obtenerColeccionFail(err),
          )
        )
      )
    )
  );

  create$ = createEffect(
    this.actions$.pipe(
      ofType(UsersActionTypes.crear),
      mergeMap((action: any) =>
        this.api.create(action.payload).pipe(
          mapResponse(
            () => UsersActions.obtenerColeccion(), // reload
            (err) => UsersActions.crearFail(err)
          )
        )
      )
    )
  );

  update$ = createEffect(
    this.actions$.pipe(
      ofType(UsersActionTypes.modificar),
      mergeMap((action: any) =>
        this.api.update(action.payload.id, action.payload.changes).pipe(
          mapResponse(
            () => UsersActions.obtenerColeccion(),
            (err) => UsersActions.modificarFail(err)
          )
        )
      )
    )
  );

  delete$ = createEffect(
    this.actions$.pipe(
      ofType(UsersActionTypes.eliminar),
      mergeMap((action: any) =>
        this.api.delete(action.payload.id).pipe(
          mapResponse(
            () => UsersActions.obtenerColeccion(),
            (err) => UsersActions.eliminarFail(err)
          )
        )
      )
    )
  );
}
