import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthStore, authLogin } from './store/auth.store';
import { LoginRequest } from '../../core/models/auth.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

/**
 * Login page component (standalone).
 *
 * Responsibilities:
 * - Render a Material form with email + password, input validation and UX niceties
 *   (password visibility toggle, inline errors, loading indicator).
 * - Dispatch the login action to AuthStore.
 * - React to AuthStore state changes to navigate or show errors.
 *
 * Notes:
 * - Uses Angular signals to track transient UI state (busy, error, toggle).
 * - Subscribes to AuthStore state with `takeUntilDestroyed` to avoid leaks.
 * - Standalone + Material modules imported locally for easy reuse.
 *
 * @author  Leon. M. Saia
 * @since   2025-08-14
 */

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(AuthStore);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  /** UI state signals */
  busy  = signal(false);
  error = signal<string | null>(null);
  hidePwd = signal(true);
  togglePwd = () => this.hidePwd.update(v => !v);

  /** Reactive form */
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  /** Computed error message for the email field */
  emailError = computed(() => {
    const c = this.form.controls.email;
    if (c.hasError('required')) return 'Email is required.';
    if (c.hasError('email'))    return 'Enter a valid email.';
    return 'Invalid email.';
  });

  /**
   * Subscribe to the AuthStore state to react to login lifecycle.
   * Navigates on success, shows error on failure.
   */
  ngOnInit(): void {
    this.store.select$()
      .pipe(
        map(s => ({ status: s.status, token: s.token, user: s.user, error: s.error })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, token, user, error }) => {
        if (status === 'ready' && token && user) {
          this.busy.set(false);
          this.router.navigate(['/']);
        } else if (status === 'error') {
          this.busy.set(false);
          this.error.set(error ?? 'Login failed.');
        }
      });
  }

  /** Submit handler for the login form. Dispatches the login action. */
  onSubmit() {
    if (this.form.invalid || this.busy()) return;

    this.busy.set(true);
    this.error.set(null);

    const payload: LoginRequest = this.form.getRawValue();
    this.store.dispatch(authLogin(payload));
  }
}
