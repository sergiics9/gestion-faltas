import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/app">Gestión Faltas</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            @if (auth.hasRole('guard')) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/app/guardias/panel" routerLinkActive="active"
                  >Panel guardia</a
                >
              </li>
            }
            @if (auth.hasRole('teacher')) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/app/dashboard" routerLinkActive="active"
                  >Dashboard</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/app/faltas/nueva" routerLinkActive="active"
                  >Registrar falta</a
                >
              </li>
            }
            @if (auth.hasRole(['admin', 'centeradmin'])) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/app/admin" routerLinkActive="active">Admin</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/app/admin/usuarios" routerLinkActive="active"
                  >Usuarios</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/app/admin/faltas" routerLinkActive="active"
                  >Faltas</a
                >
              </li>
            }
          </ul>
          <div class="d-flex align-items-center gap-2">
            <span class="text-light me-2">{{ auth.user()?.name }}</span>
            <button class="btn btn-outline-light btn-sm" (click)="auth.logout()">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './navbar.scss',
})
export class Navbar {
  auth = inject(AuthService);
}
