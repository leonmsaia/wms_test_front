// src/app/features/auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore, authLogin } from './store/auth.store';
import { Router } from '@angular/router';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-card">
      <h1>Login</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email</label>
        <input type="email" formControlName="email" placeholder="email@example.com" />

        <label>Password</label>
        <input type="password" formControlName="password" placeholder="********" />

        <button type="submit" [disabled]="form.invalid || busy()">Sign in</button>
      </form>

      <p class="error" *ngIf="error()">{{ error() }}</p>
    </div>
  `,
  styles: [`
    .login-card { max-width:360px; margin:40px auto; display:flex; flex-direction:column; gap:12px; }
    form { display:flex; flex-direction:column; gap:8px; }
    .error { color: #c0392b; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(AuthStore);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  busy  = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set(null);

    const payload: LoginRequest = this.form.getRawValue();

    this.store.dispatch(authLogin(payload));

    setTimeout(() => {
      const s = this.store.state();
      this.busy.set(false);
      if (s.user && s.token) this.router.navigate(['/']);
      else if (s.error) this.error.set(s.error);
    }, 400);
  }
}
