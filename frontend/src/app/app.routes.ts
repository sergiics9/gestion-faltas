import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';
import { roleGuard } from './guards/role';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'guard',
    loadComponent: () =>
      import('./features/guard/guard-dashboard').then((m) => m.GuardDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['guard'] },
  },
  {
    path: 'teacher',
    loadComponent: () =>
      import('./features/teacher/teacher-dashboard').then((m) => m.TeacherDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher'] },
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-layout').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'centeradmin'] },
    children: [
      { path: '', redirectTo: 'teachers', pathMatch: 'full' },
      {
        path: 'teachers',
        loadComponent: () =>
          import('./features/admin/teachers/teachers').then((m) => m.TeachersComponent),
      },
      {
        path: 'timeslots',
        loadComponent: () =>
          import('./features/admin/timeslots/timeslots').then((m) => m.TimeslotsComponent),
      },
      {
        path: 'classrooms',
        loadComponent: () =>
          import('./features/admin/classrooms/classrooms').then((m) => m.ClassroomsComponent),
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('./features/admin/subjects/subjects').then((m) => m.SubjectsComponent),
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./features/admin/schedules/schedules').then((m) => m.SchedulesComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
