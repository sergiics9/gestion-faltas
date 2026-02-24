import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/admin">Admin — IES Pere Maria</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" routerLink="/admin/teachers" routerLinkActive="active">Profesores</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/admin/timeslots" routerLinkActive="active">Franjas horarias</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/admin/classrooms" routerLinkActive="active">Aulas</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/admin/subjects" routerLinkActive="active">Asignaturas</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/admin/schedules" routerLinkActive="active">Horarios</a></li>
          </ul>
          <span class="navbar-text text-light me-2">{{ auth.user()?.name }}</span>
          <button class="btn btn-outline-light btn-sm" (click)="auth.logout()">Salir</button>
        </div>
      </div>
    </nav>
    <div class="container-fluid py-3">
      <router-outlet />
    </div>
  `,
})
export class AdminLayoutComponent {
  constructor(public auth: AuthService) {}
}
