import { Component } from '@angular/core';
import { Roles } from '../../../types/roles';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
    <nav class="navbar">
      <h1 class="nav-title">Logo</h1>

      <div class="nav-actions">
        @switch (role) {
          @case ('admin') {}
          @case ('centeradmin') {}
          @case ('teacher') {}
          @case ('guard') {}
          @default {
            <button class="ghost">Hoy</button>
            <button>Toda la semana</button>
            <button class="primary">Todo el mes</button>
          }
        }
      </div>
    </nav>
  `,
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly role!: Roles;
}
