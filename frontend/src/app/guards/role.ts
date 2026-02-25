import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles: string[] = route.data['roles'] ?? [];
  if (roles.length && auth.hasRole(roles)) return true;
  const user = auth.user();
  if (user?.role === 'guard') router.navigate(['/guard']);
  else if (user?.role === 'teacher') router.navigate(['/teacher']);
  else if (user?.role === 'admin' || user?.role === 'centeradmin') router.navigate(['/admin']);
  else router.navigate(['/login']);
  return false;
};
