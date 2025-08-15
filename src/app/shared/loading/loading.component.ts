// src/app/shared/loading/loading.component.ts
import { Component, Input } from '@angular/core';

/**
 * Generic loading spinner component.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  template: `<div class="p-3" *ngIf="show"><mat-progress-spinner mode="indeterminate"></mat-progress-spinner></div>`,
})
export class LoadingComponent {
  @Input() show = false;
}