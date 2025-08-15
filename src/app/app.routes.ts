// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/ui/usuario-listado/usuario-listado.component')
        .then(m => m.UsuarioListadoComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];