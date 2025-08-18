// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
* The root component of the Angular application.
*
* @author  Leon. M. Saia
* @since   2025-08-14
*/

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {}
