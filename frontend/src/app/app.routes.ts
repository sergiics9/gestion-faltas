import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ProfesorDashboard } from './components/profesores/profesor-dashboard/profesor-dashboard';
import { ProfesorFaltaForm } from './components/profesores/profesor-falta-form/profesor-falta-form';
import { ProfesorHistorialFaltas } from './components/profesores/profesor-historial-faltas/profesor-historial-faltas';
import { GuardiaHorario } from './components/guardias/guardia-horario/guardia-horario';
import { GuardiaAsignacion } from './components/guardias/guardia-asignacion/guardia-asignacion';
import { AdminPanel } from './components/admin/admin-panel/admin-panel';
import { AdminUsuarios } from './components/admin/admin-usuarios/admin-usuarios';
import { AdminFaltas } from './components/admin/admin-faltas/admin-faltas';

export const routes: Routes = [
  // Layout login
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', component: Login },
      { path: 'register', component: Register },
    ],
  },

  // Layout principal app
  {
    path: 'app',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: ProfesorDashboard },
      { path: 'faltas/nueva', component: ProfesorFaltaForm },
      { path: 'faltas/historial', component: ProfesorHistorialFaltas },

      { path: 'guardias/horario', component: GuardiaHorario },
      { path: 'guardias/asignacion', component: GuardiaAsignacion },

      { path: 'admin', component: AdminPanel },
      { path: 'admin/usuarios', component: AdminUsuarios },
      { path: 'admin/faltas', component: AdminFaltas },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // fallback
  { path: '**', redirectTo: '' },
];
