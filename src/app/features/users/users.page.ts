// src/app/features/users/users.page.ts
import { Component, signal } from '@angular/core';
import { UsuarioListadoModule } from './ui/usuario-listado/usuario-listado.module';
import { UsuarioFormularioModule } from './ui/usuario-formulario/usuario-formulario.module';
import { User } from '../../core/models/user.model';

/**
 * Users page composing list + form (SCAM components).
 * The form is used for both creating and editing users.
 * It uses a signal to track the user being edited.
 * On form submission, it resets the editing signal.
 * This page serves as the main entry point for user management.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  standalone: true,
  selector: 'app-users-page',
  imports: [UsuarioListadoModule, UsuarioFormularioModule],
  template: `
    <div class="grid gap-4 p-3">
      <app-usuario-formulario (saved)="onSaved()" [user]="editing()"></app-usuario-formulario>
      <app-usuario-listado></app-usuario-listado>
    </div>
  `,
})
export class UsersPage {
  editing = signal<User | null>(null);
  onSaved() {
    this.editing.set(null);
  }
}
