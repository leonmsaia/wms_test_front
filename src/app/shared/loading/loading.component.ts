// src/app/shared/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
* A loading component that displays a spinner when data is being loaded.
* This component can be used to indicate to users that an operation is in progress.
* It accepts an input property `show` to control its visibility.
* It is designed to be used in various parts of the application where loading states are required.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="p-3" *ngIf="show">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
  `,
  styles: [`.p-3{padding:12px; display:flex; justify-content:center;}`]
})
export class LoadingComponent {
  @Input() show = false;
}