import { Component } from '@angular/core';
import { Roles } from '../../../types/roles';

@Component({
  selector: 'app-navbar',
  imports: [],
  template: `
    <nav>
      <h1 class="nav-title">Gestión de faltas</h1>

      <nav>
        @switch (role) {
          @case ('admin') {}
          @case ('centeradmin') {}
          @case ('teacher') {}
          @case ('guard') {}
          @default {}
        }
      </nav>
    </nav>
  `,
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly role!: Roles;
}
