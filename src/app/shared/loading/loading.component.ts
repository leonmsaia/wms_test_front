// src/app/shared/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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