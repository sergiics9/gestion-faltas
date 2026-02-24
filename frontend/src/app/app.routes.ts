import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';

import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ProfesorDashboard } from './components/profesores/profesor-dashboard/profesor-dashboard';
import { ProfesorFaltaForm } from './components/profesores/profesor-falta-form/profesor-falta-form';
import { ProfesorHistorialFaltas } from './components/profesores/profesor-historial-faltas/profesor-historial-faltas';
import { GuardiaPanel } from './components/guardias/guardia-panel/guardia-panel';
import { AdminPanel } from './components/admin/admin-panel/admin-panel';
import { AdminUsuarios } from './components/admin/admin-usuarios/admin-usuarios';
import { AdminFaltas } from './components/admin/admin-faltas/admin-faltas';
import { AdminHorario } from './components/admin/admin-horario/admin-horario';
import { AdminCentros } from './components/admin/admin-centros/admin-centros';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      { path: '', component: Login },
      { path: 'register', component: Register },
    ],
  },

  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: ProfesorDashboard, canActivate: [roleGuard('teacher')] },
      { path: 'faltas/nueva', component: ProfesorFaltaForm, canActivate: [roleGuard('teacher')] },
      {
        path: 'faltas/historial',
        component: ProfesorHistorialFaltas,
        canActivate: [roleGuard('teacher')],
      },

      { path: 'guardias/panel', component: GuardiaPanel, canActivate: [roleGuard('guard')] },

      { path: 'admin', component: AdminPanel, canActivate: [roleGuard(['admin', 'centeradmin'])] },
      {
        path: 'admin/usuarios',
        component: AdminUsuarios,
        canActivate: [roleGuard(['admin', 'centeradmin'])],
      },
      {
        path: 'admin/horario',
        component: AdminHorario,
        canActivate: [roleGuard(['admin', 'centeradmin'])],
      },
      { path: 'admin/centros', component: AdminCentros, canActivate: [roleGuard('admin')] },
      {
        path: 'admin/faltas',
        component: AdminFaltas,
        canActivate: [roleGuard(['admin', 'centeradmin'])],
      },
      { path: '', redirectTo: 'guardias/panel', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
