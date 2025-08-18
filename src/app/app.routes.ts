// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from '@app/features/auth/login.component';
import { authGuard } from '@app/core/guards/auth.guard';

import { UsuarioListadoComponent } from '@app/features/users/ui/usuario-listado/usuario-listado.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: UsuarioListadoComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
