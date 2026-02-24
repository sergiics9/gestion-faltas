import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function guestGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return true;

  const role = auth.currentRole();
  const redirect: Record<string, string> = {
    admin: '/app/admin',
    centeradmin: '/app/admin',
    teacher: '/app/dashboard',
    guard: '/app/guardias/panel',
  };
  router.navigate([redirect[role ?? ''] ?? '/app']);
  return false;
}
