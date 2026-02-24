import { Injectable, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import type { Usuario, LoginRequest, LoginResponse } from '../interfaces/usuario';
import { getStoredToken } from '../interceptors/auth-interceptor';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userSubject = new BehaviorSubject<Usuario | null>(this.loadStoredUser());
  private tokenSubject = new BehaviorSubject<string | null>(getStoredToken());

  user = toSignal(this.userSubject.asObservable(), { initialValue: this.loadStoredUser() });
  token = toSignal(this.tokenSubject.asObservable(), { initialValue: getStoredToken() });

  isAuthenticated = computed(() => !!this.token());
  currentRole = computed(() => this.user()?.role ?? null);

  private loadStoredUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  login(creds: LoginRequest): Observable<{ ok: boolean; error?: string }> {
    return this.http.post<LoginResponse>(`${API}/auth/login`, creds).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.tokenSubject.next(res.token);
        this.userSubject.next(res.user);
      }),
      map(() => ({ ok: true })),
      catchError((err) => of({ ok: false, error: err.error?.message ?? 'Error de login' })),
    );
  }

  logout(): void {
    this.http
      .post(`${API}/auth/logout`, {})
      .pipe(catchError(() => of(null)))
      .subscribe();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  refreshMe(): Observable<Usuario | null> {
    return this.http.get<Usuario>(`${API}/auth/me`).pipe(
      tap((u) => {
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        this.userSubject.next(u);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }

  hasRole(role: string | string[]): boolean {
    const r = this.currentRole();
    if (!r) return false;
    if (Array.isArray(role)) return role.includes(r);
    return r === role;
  }
}
