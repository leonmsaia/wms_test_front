// src/app/features/users/ui/usuario-listado/usuario-listado.component.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
import { UsuarioFormularioComponent } from '../usuario-formulario/usuario-formulario.component';

@Component({
  selector: 'app-usuario-listado',
  standalone: true,
  imports: [
    NgIf, AsyncPipe, FormsModule,
    MatTableModule, MatPaginatorModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatIconModule, MatDialogModule,
    LoadingComponent,
  ],
  template: `
<section class="page">
  <header class="header">
  <h1>Usuarios</h1>
  <span class="spacer"></span>
  <button mat-stroked-button color="warn" (click)="onLogout()">
    <mat-icon>logout</mat-icon>
    Cerrar sesión
  </button>
  <button mat-flat-button color="primary" (click)="onCreate()">
    <mat-icon>person_add</mat-icon>
    Nuevo usuario
  </button>
</header>

  <ng-container *ngIf="vm$ | async as vm">
    <div class="toolbar">
      <mat-form-field appearance="outline">
        <mat-label>Rol</mat-label>
        <mat-select [ngModel]="vm.filters.role || ''" (ngModelChange)="onRoleChange($event)">
          <mat-option [value]="''">Todos</mat-option>
          <mat-option [value]="'Admin'">Admin</mat-option>
          <mat-option [value]="'User'">User</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="grow" appearance="outline">
        <mat-label>Buscar por nombre o apellido</mat-label>
        <input matInput [ngModel]="vm.filters.q || ''" (ngModelChange)="onSearchInput($event)" />
        <button mat-icon-button matSuffix aria-label="Buscar" (click)="forceSearch()">
          <mat-icon>search</mat-icon>
        </button>
      </mat-form-field>
    </div>

    <app-loading [show]="vm.loading" message="Cargando usuarios..."></app-loading>
    <div class="error" *ngIf="!vm.loading && vm.error">
      {{ vm.error }}
    </div>

    <table mat-table [dataSource]="vm.items || []" class="mat-elevation-z1" *ngIf="!vm.loading && !vm.error">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let u">{{ u.id }}</td>
      </ng-container>

      <ng-container matColumnDef="nombre">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let u">{{ u.nombre }}</td>
      </ng-container>

      <ng-container matColumnDef="apellido">
        <th mat-header-cell *matHeaderCellDef>Apellido</th>
        <td mat-cell *matCellDef="let u">{{ u.apellido }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let u">{{ u.email }}</td>
      </ng-container>

      <ng-container matColumnDef="rol">
        <th mat-header-cell *matHeaderCellDef>Rol</th>
        <td mat-cell *matCellDef="let u">{{ u.rol }}</td>
      </ng-container>

      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef class="w-acciones">Acciones</th>
        <td mat-cell *matCellDef="let u" class="acciones">
          <button mat-icon-button color="primary" (click)="onEdit(u)" aria-label="Editar">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onRemove(u)" aria-label="Eliminar">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>

      <tr class="empty" *ngIf="!vm.items?.length">
        <td colspan="6">No hay usuarios para los filtros aplicados.</td>
      </tr>
    </table>

    <mat-paginator
      *ngIf="vm.total && (vm.lastPage ?? 1) > 1"
      [length]="vm.total || 0"
      [pageIndex]="(vm.page || 1) - 1"
      [pageSize]="vm.perPage || 10"
      [pageSizeOptions]="[vm.perPage || 10]"
      (page)="onPage($event)">
    </mat-paginator>
  </ng-container>
</section>
`,
  styles: [`
    .page { padding: 16px; display: grid; gap: 12px; }
    .header { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
    .toolbar { display:flex; gap:12px; align-items:center; }
    .grow { flex:1; min-width: 260px; }
    table { width:100%; }
    .w-acciones { width: 120px; }
    .acciones { display:flex; gap:4px; }
    .error { background:#fee; color:#900; padding:.5rem; border:1px solid #f99; border-radius:6px; }
    .empty { text-align:center; color:#666; height:56px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioListadoComponent implements OnInit {
  private store = inject<Store>(Store as any);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  cols = ['id', 'nombre', 'apellido', 'email', 'rol', 'acciones'] as const;

  private qInput$ = new Subject<string>();

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

    this.store.dispatch(UsersActions.obtenerColeccion());
    this.qInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(q => {
      this.store.dispatch(UsersActions.setFilters({ q }));
      this.store.dispatch(UsersActions.obtenerColeccion());
    });
  }

  onRoleChange(role: '' | Rol) {
    this.store.dispatch(UsersActions.setFilters({ role: role ?? '' }));
    this.store.dispatch(UsersActions.obtenerColeccion());
  }

  onSearchInput(q: string) {
    this.qInput$.next(q ?? '');
  }

  forceSearch() {
    this.qInput$.next('');
  }

  onPage(e: PageEvent) {
    this.store.dispatch(UsersActions.setPage({ page: e.pageIndex + 1 }));
    this.store.dispatch(UsersActions.obtenerColeccion());
  }

  onCreate() {
    const ref = this.dialog.open(UsuarioFormDialog, { width: '520px', data: null });
    ref.afterClosed().subscribe(() => {
    });
  }

  onLogout() {
    this.authStore.dispatch(authLogout());
    this.router.navigate(['/login']);
  }

  onEdit(user: User) {
    const ref = this.dialog.open(UsuarioFormDialog, { width: '520px', data: user });
    ref.afterClosed().subscribe(() => {
    });
  }

  onRemove(user: User) {
    if (!confirm(`¿Eliminar usuario #${user.id} (${user.nombre} ${user.apellido})?`)) return;
    this.store.dispatch(UsersActions.eliminar({ id: user.id }));
  }
}

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, UsuarioFormularioComponent],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
    <div mat-dialog-content>
      <app-usuario-formulario [user]="data" (saved)="close()"></app-usuario-formulario>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cerrar</button>
    </div>
  `,
})
export class UsuarioFormDialog {
  constructor(
    private dialogRef: MatDialogRef<UsuarioFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
  ) { }

  close() { this.dialogRef.close(); }
}