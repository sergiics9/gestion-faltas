import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'auth_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getStoredToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
