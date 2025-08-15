// src/app/features/auth/login.component.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthApiService } from '../../core/services/auth-api.service';
import { TokenService } from '../../core/services/token.service';
import { Router, RouterLink } from '@angular/router';

/**
 * Login form using reactive forms and Sanctum-based auth.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1>Login</h1>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input placeholder="Email" formControlName="email" type="email" />
      <input placeholder="Password" formControlName="password" type="password" />
      <button type="submit" [disabled]="form.invalid || loading">Login</button>
      <p *ngIf="error" style="color:red">{{ error }}</p>
    </form>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthApiService);
  private token = inject(TokenService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => {
        this.token.set(res.access_token);
        this.router.navigateByUrl('/usuarios');
      },
      error: (e) => {
        this.error = e?.error?.message ?? 'Login failed';
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
