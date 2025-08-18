// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
* The root component of the Angular application.
* This component serves as the main entry point for the application,
* rendering the router outlet where all routed components will be displayed.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
