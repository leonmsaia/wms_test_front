// src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
* Dialog component for confirming actions.
* This component provides a simple confirmation dialog
* with a title, message, and two buttons:
* - Cancel: Closes the dialog without action
* - Confirm: Closes the dialog and returns true
* It can be used for actions like deletion confirmation.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.title || 'Confirmar' }}</h2>
    <div mat-dialog-content>{{ data?.message || '¿Estás seguro?' }}</div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancelar</button>
      <button mat-raised-button color="warn" (click)="close(true)">Eliminar</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}
  close(v: boolean) { this.ref.close(v); }
}
