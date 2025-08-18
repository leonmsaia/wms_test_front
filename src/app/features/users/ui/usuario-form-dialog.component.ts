// src/app/features/users/ui/usuario-form-dialog.component.ts
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioFormularioComponent } from './usuario-formulario/usuario-formulario.component';
import { User } from '../../../core/services/users.api';

/**
 * Dialog host for the user form (create / edit).
 *
 * This component encapsulates the modal shell and passes the selected user
 * (if any) to the standalone form component. The form component emits `saved`
 * when the create/update action is dispatched successfully, and this dialog
 * closes in response.
 *
 * It does not implement business logic, only modal responsibilities:
 * - Show title depending on edit vs create
 * - Render the form content
 * - Provide a Close button
 */

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, UsuarioFormularioComponent],
  templateUrl: './usuario-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioFormDialogComponent {
  /**
   * @param dialogRef Reference to close the modal programmatically.
   * @param data Optional user to edit (if null → create).
   */
  constructor(
    private dialogRef: MatDialogRef<UsuarioFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
  ) {}
  close() { this.dialogRef.close(); }
}