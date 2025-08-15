// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPage } from './features/auth/login.page';
import { UsersPage } from './features/users/users.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'usuarios', component: UsersPage, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
  { path: '**', redirectTo: 'usuarios' }
];
