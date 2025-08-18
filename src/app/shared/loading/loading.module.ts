// src/app/shared/loading/loading.module.ts
import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
* Module for the loading component.
* This module imports the necessary dependencies for the loading component
* and exports the component for use in other parts of the application.
* It includes the MatProgressSpinnerModule for displaying a spinner
* when data is being loaded.
* It is designed to be used in various parts of the application
* where loading states are required.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@NgModule({
  imports: [MatProgressSpinnerModule, LoadingComponent],
  exports: [LoadingComponent],
})
export class LoadingModule {}
