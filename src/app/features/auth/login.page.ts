// src/app/features/auth/login.page.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthApi } from '../../core/services/auth.api';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Simple login page; stores token on success.
 * Uses reactive form with email and password fields.
 * On submit, it calls the AuthApi to login.
 * Displays an error message on failure.
 * Validations:
 * - Email: required, valid email format.
 * - Password: required.
 * On success, it navigates to the users page.
 * Emits an error message if login fails.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <section class="p-3">
    <h2>Login</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3">
      <input type="email" placeholder="email" formControlName="email">
      <input type="password" placeholder="password" formControlName="password">
      <button type="submit">Login</button>
    </form>
    <p *ngIf="error" style="color:crimson">{{error}}</p>
  </section>
  `
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private api = inject(AuthApi);
  private tokens = inject(TokenService);
  private router = inject(Router);

  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.error = '';
    this.api.login(this.form.value as any).subscribe({
      next: (res) => {
        this.tokens.set(res.access_token);
        this.router.navigate(['/usuarios']);
      },
      error: () => this.error = 'Invalid credentials',
    });
  }
}
