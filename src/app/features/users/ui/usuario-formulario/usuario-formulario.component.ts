// src/app/features/users/ui/usuario-formulario/usuario-formulario.component.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from 'mini-rx-store';
import { UsersActions } from '../../store/users.actions';
import { User } from '../../../../core/models/user.model';

/**
 * Reactive form used for add/edit users with validations.
 * Includes fields for name, surname, email, role, and password.
 * On submit, it dispatches create or update actions to the store.
 * Emits 'saved' event after successful submission.
 * Validations:
 * - Name and surname: required, min 3 characters.
 * - Email: required, valid email format.
 * Role: required, default to 'User'.
 * Password: optional on edit, required on create.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  selector: 'app-usuario-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
  <form class="grid gap-3" [formGroup]="form" (ngSubmit)="onSubmit()">
    <mat-form-field appearance="outline">
      <mat-label>Nombre</mat-label>
      <input matInput formControlName="nombre" />
      <mat-error *ngIf="form.controls.nombre.invalid">Min 3 chars</mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Apellido</mat-label>
      <input matInput formControlName="apellido" />
      <mat-error *ngIf="form.controls.apellido.invalid">Min 3 chars</mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput type="email" formControlName="email" />
      <mat-error *ngIf="form.controls.email.invalid">Invalid email</mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Rol</mat-label>
      <mat-select formControlName="rol">
        <mat-option value="Admin">Admin</mat-option>
        <mat-option value="User">User</mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Password</mat-label>
      <input matInput type="password" formControlName="password" />
    </mat-form-field>

    <button mat-flat-button color="primary" type="submit">{{user ? 'Update' : 'Create'}}</button>
  </form>
  `,
})
export class UsuarioFormularioComponent {
  private fb = inject(FormBuilder);
  private store = inject<Store>(Store as any);

  @Input() user?: User | null;
  @Output() saved = new EventEmitter<void>();

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellido: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]] ,
    rol: ['User', [Validators.required]],
    password: [''], // optional on edit
  });

  ngOnChanges() {
    if (this.user) {
      this.form.patchValue({
        nombre: this.user.nombre,
        apellido: this.user.apellido,
        email: this.user.email,
        rol: this.user.rol,
      });
    } else {
      this.form.reset({ rol: 'User' });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const v = this.form.value;
    if (this.user) {
      this.store.dispatch(UsersActions.modificar({ id: this.user.id, changes: v }));
    } else {
      this.store.dispatch(UsersActions.crear(v));
    }
    this.saved.emit();
  }
}
