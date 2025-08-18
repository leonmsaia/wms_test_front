// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from '@app/features/auth/login.component';
import { authGuard } from '@app/core/guards/auth.guard';
import { PrivateLayoutComponent } from '@app/features/layout/private-layout.component';
import { UsuarioListadoComponent } from '@app/features/users/ui/usuario-listado/usuario-listado.component';

/**
* Application routes configuration.
* This file defines the main routing structure for the application,
* including public and private routes, guards, and lazy-loaded modules.
* It sets up the login route and the main application layout
* for authenticated users.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    component: PrivateLayoutComponent,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: UsuarioListadoComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];