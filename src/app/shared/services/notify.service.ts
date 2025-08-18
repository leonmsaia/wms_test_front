import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
* NotifyService provides methods to show success and error notifications using MatSnackBar.
* It is used throughout the application to provide user feedback on actions.
* - `success(msg: string)`: Shows a success message with a green background.
* - `error(msg: string)`: Shows an error message with a red background.
* Both methods automatically dismiss after a set duration.
* This service is injected into components or services where notifications are needed.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@Injectable({ providedIn: 'root' })
export class NotifyService {
  private sb = inject(MatSnackBar);
  success(msg: string) { this.sb.open(msg, 'OK', { duration: 2500, panelClass: ['snack-success'] }); }
  error(msg: string)   { this.sb.open(msg, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] }); }
}
