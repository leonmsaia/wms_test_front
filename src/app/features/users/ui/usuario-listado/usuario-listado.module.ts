// src/app/features/users/ui/usuario-listado/usuario-listado.module.ts
import { NgModule } from '@angular/core';
import { UsuarioListadoComponent } from './usuario-listado.component';

/**
* Module for the user listing component.
* This module imports the necessary dependencies for the user listing component
* and exports the component for use in other parts of the application.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@NgModule({
  imports: [UsuarioListadoComponent],
  exports: [UsuarioListadoComponent],
})
export class UsuarioListadoModule {}
