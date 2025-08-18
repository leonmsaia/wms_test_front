// src/app/features/users/ui/usuario-listado/usuario-listado.component.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';

import { debounceTime, distinctUntilChanged, map, Subject, combineLatest, Observable } from 'rxjs';
import { Store } from 'mini-rx-store';

import { LoadingComponent } from '@app/shared/loading/loading.component';
import { UsersActions } from '../../store/users.actions';
import { User, Rol } from '../../../../core/services/users.api';
import {
  selectItems, selectLoading, selectError,
  selectPage, selectPerPage, selectTotal, selectFilters, selectLastPage
} from '../../store/users.selectors';
import { AuthStore, authLogout } from '@app/features/auth/store/auth.store';
import { UsuarioFormDialogComponent } from '../usuario-form-dialog.component';

/**
 * Users listing container component.
 *
 * Displays the users table with pagination, filters and item actions (create, edit, delete).
 * It orchestrates the UI state from the MiniRx store and triggers effects through actions.
 * Visual presentation follows Angular Material guidelines (toolbar, cards, table, paginator).
 *
 * Key responsibilities:
 * - Load initial collection and react to pagination / filter changes
 * - Open the create/edit dialog and forward the resulting actions
 * - Dispatch delete action after user confirmation (browser confirm for now)
 * - Trigger logout and route to login
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  selector: 'app-usuario-listado',
  standalone: true,
  imports: [
    // Angular
    NgIf, NgFor, AsyncPipe, FormsModule,
    // Material
    MatToolbarModule, MatCardModule, MatDividerModule,
    MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    MatChipsModule, MatBadgeModule,
    // Dialog host (opened from here)
    // Nota: el dialogo es standalone y se importa en runtime via MatDialog.open()
    // no es necesario importarlo aquí.
    // Shared
    LoadingComponent,
  ],
  templateUrl: './usuario-listado.component.html',
  styleUrls: ['./usuario-listado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioListadoComponent implements OnInit {
  private store = inject<Store>(Store as any);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  /** Displayed columns for the Material table. */
  cols = ['id', 'nombre', 'apellido', 'email', 'rol', 'acciones'] as const;

  /** Debounced input stream for full-text search. */
  private qInput$ = new Subject<string>();

  /** ViewModel stream aggregated from store selectors. */
  vm$!: Observable<{
    items: User[];
    loading: boolean;
    error: string | null | undefined;
    page: number;
    perPage: number;
    total: number;
    filters: { role?: '' | 'Admin' | 'User'; q?: string };
    lastPage: number;
  }>;

  /**
   * Initialize the VM stream, trigger initial collection load,
   * and wire up the debounced search pipeline.
   */
  ngOnInit(): void {
    this.vm$ = combineLatest([
      this.store.select(selectItems),
      this.store.select(selectLoading),
      this.store.select(selectError),
      this.store.select(selectPage),
      this.store.select(selectPerPage),
      this.store.select(selectTotal),
      this.store.select(selectFilters),
      this.store.select(selectLastPage),
    ]).pipe(
      map(([items, loading, error, page, perPage, total, filters, lastPage]) => ({
        items, loading, error, page, perPage, total, filters, lastPage
      }))
    );

    // Initial load
    this.store.dispatch(UsersActions.obtenerColeccion());

    // Debounced search
    this.qInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(q => {
      this.store.dispatch(UsersActions.setFilters({ q }));
      this.store.dispatch(UsersActions.obtenerColeccion());
    });
  }

  /**
   * Handle role filter changes.
   * Resets page (handled by reducer on setFilters) and reloads collection.
   * @param role Selected role filter ('' | 'Admin' | 'User')
   */
  onRoleChange(role: '' | Rol) {
    this.store.dispatch(UsersActions.setFilters({ role: role ?? '' }));
    this.store.dispatch(UsersActions.obtenerColeccion());
  }

  /**
   * Handle search input updates with debounce.
   * @param q Free-text query string
   */
  onSearchInput(q: string) {
    this.qInput$.next(q ?? '');
  }

  /**
   * Force a search emission (uses current debounced pipeline).
   * Can be enhanced to emit the current text value explicitly.
   */
  forceSearch() {
    this.qInput$.next('');
  }

  /**
   * Handle paginator events (Material paginator is 0-based;
   * store pagination is 1-based).
   * @param e Page event from MatPaginator
   */
  onPage(e: PageEvent) {
    this.store.dispatch(UsersActions.setPage({ page: e.pageIndex + 1 }));
    this.store.dispatch(UsersActions.obtenerColeccion());
  }

  /**
   * Open dialog for creating a new user.
   * The dialog itself dispatches actions via the embedded form component.
   */
  onCreate() {
    this.dialog.open(UsuarioFormDialogComponent, { width: '520px', data: null });
  }

  /**
   * Trigger logout across the AuthStore and navigate to /login.
   */
  onLogout() {
    this.authStore.dispatch(authLogout());
    this.router.navigate(['/login']);
  }

  /**
   * Open dialog for editing an existing user.
   * @param user Selected user to edit
   */
  onEdit(user: User) {
    this.dialog.open(UsuarioFormDialogComponent, { width: '520px', data: user });
  }

  /**
   * Ask for confirmation (browser confirm for now) and dispatch delete.
   * Can be replaced with a Material confirm dialog in the future.
   * @param user Selected user to delete
   */
  onRemove(user: User) {
    if (!confirm(`¿Eliminar usuario #${user.id} (${user.nombre} ${user.apellido})?`)) return;
    this.store.dispatch(UsersActions.eliminar({ id: user.id }));
  }
}