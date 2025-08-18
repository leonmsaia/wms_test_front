import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore, authLogout } from '@app/features/auth/store/auth.store';
import { Router } from '@angular/router';

/**
 * Private layout shell for authenticated sections.
 *
 * Responsibilities:
 * - Provide a sticky top toolbar with the application title (and room for actions).
 * - Host routed feature components via <router-outlet>.
 * - Offer a logout method that clears session via AuthStore and redirects to /login.
 *
 * Note:
 * - UI actions can be extended here (user menu, breadcrumbs, etc).
 * - Uses Angular Material for consistent styling.
 * - Standalone component for easy reuse in other layouts.
 */
@Component({
  standalone: true,
  selector: 'app-private-layout',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.scss'],
})
export class PrivateLayoutComponent {
  private auth = inject(AuthStore);
  private router = inject(Router);

  /** Logout and route back to login page. */
  logout() {
    this.auth.dispatch(authLogout());
    this.router.navigate(['/login']);
  }
}
