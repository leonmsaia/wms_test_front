// src/app/shared/loading/loading.module.ts
import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [MatProgressSpinnerModule, LoadingComponent],
  exports: [LoadingComponent],
})
export class LoadingModule {}
