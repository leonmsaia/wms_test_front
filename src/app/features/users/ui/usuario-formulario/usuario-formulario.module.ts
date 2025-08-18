// src/app/features/users/ui/usuario-formulario/usuario-formulario.module.ts
import { NgModule } from '@angular/core';
import { UsuarioFormularioComponent } from './usuario-formulario.component';

/**
* Module for the user form component.
* This module imports the necessary dependencies for the user form component
* and exports the component for use in other parts of the application.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@NgModule({
  imports: [UsuarioFormularioComponent],
  exports: [UsuarioFormularioComponent],
})
export class UsuarioFormularioModule {}
