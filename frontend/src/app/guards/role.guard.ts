import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../interfaces/usuario';

export function roleGuard(allowedRoles: UserRole | UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!auth.isAuthenticated()) {
      router.navigate(['/']);
      return false;
    }

    const current = auth.currentRole();
    if (current && roles.includes(current)) return true;

    // Redirigir al panel apropiado según rol
    const fallback: Record<string, string> = {
      admin: '/app/admin',
      centeradmin: '/app/admin',
      teacher: '/app/dashboard',
      guard: '/app/guardias/panel',
    };
    router.navigate([fallback[current ?? ''] ?? '/app']);
    return false;
  };
}
