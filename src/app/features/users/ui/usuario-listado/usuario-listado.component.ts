// src/app/features/users/ui/usuario-listado/usuario-listado.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from 'mini-rx-store';
import { UsersActions } from '../../store/users.actions';
import { UsersState } from '../../store/users.reducer';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { LoadingModule } from '../../../../shared/loading/loading.module';
import { User } from '../../../../core/models/user.model';

/**
 * Users list with filters (role, q) and pagination (10 per page).
 * Uses MiniRx store to drive loading/error/data.
 * Displays a loading spinner while data is being fetched.
 * The table shows user details: name, surname, email, and role.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  selector: 'app-usuario-listado',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LoadingModule,
  ],
  template: `
  <section class="p-3">
    <h2>Usuarios</h2>

    <div class="filters">
      <mat-form-field appearance="outline">
        <mat-label>Rol</mat-label>
        <mat-select [value]="role()" (selectionChange)="onRole($event.value)">
          <mat-option value="">Todos</mat-option>
          <mat-option value="Admin">Admin</mat-option>
          <mat-option value="User">User</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="ml-2">
        <mat-label>Buscar por nombre o apellido</mat-label>
        <input matInput [value]="q()" (input)="onQ($any($event.target).value)" />
      </mat-form-field>
    </div>

    <app-loading [show]="loading()"></app-loading>

    <table mat-table [dataSource]="items()">
      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let u">{{u.nombre}}</td>
      </ng-container>
      <ng-container matColumnDef="apellido">
        <th mat-header-cell *matHeaderCellDef>Apellido</th>
        <td mat-cell *matCellDef="let u">{{u.apellido}}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let u">{{u.email}}</td>
      </ng-container>
      <ng-container matColumnDef="rol">
        <th mat-header-cell *matHeaderCellDef>Rol</th>
        <td mat-cell *matCellDef="let u">{{u.rol}}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>

    <mat-paginator [length]="total()" [pageSize]="perPage()" [pageIndex]="page()-1"
                   (page)="onPage($event)"></mat-paginator>
  </section>
  `,
  styles: [`.filters{display:flex; gap:1rem; align-items:center; margin-bottom:1rem}`]
})
export class UsuarioListadoComponent {
  private store = inject<Store>(Store as any);

  cols = ['nombre', 'apellido', 'email', 'rol'];

  // local signals
  role = signal<string>('');
  q = signal<string>('');

  // derived from store
  state = signal<UsersState>({} as any);
  loading = computed(() => this.state().loading ?? false);
  items = computed<User[]>(() => this.state().items ?? []);
  total = computed<number>(() => this.state().total ?? 0);
  page = computed<number>(() => this.state().page ?? 1);
  perPage = computed<number>(() => this.state().per_page ?? 10);

  constructor() {
    // subscribe store -> signal
    effect(() => {
      this.store.select((s: any) => s.users).subscribe(s => this.state.set(s));
    });

    // initial load
    this.store.dispatch(UsersActions.obtenerColeccion());
  }

  onRole(value: string) {
    this.role.set(value);
    this.store.dispatch(UsersActions.setFilters({ role: value as any }));
  }

  onQ(val: string) {
    this.q.set(val);
    this.store.dispatch(UsersActions.setFilters({ q: val }));
  }

  onPage(e: PageEvent) {
    this.store.dispatch(UsersActions.setPage({ page: e.pageIndex + 1 }));
  }
}
