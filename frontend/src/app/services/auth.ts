import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import type { User, LoginResponse } from '../interfaces/api';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(this.getStoredToken());
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.token());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (this.token()) this.fetchMe();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  private fetchMe(): void {
    this.http.get<User>(`${API}/auth/me`).pipe(
      tap((u) => this.currentUser.set(u)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    ).subscribe();
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${API}/auth/login`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.token.set(res.token);
        this.currentUser.set({
          id: res.user.id,
          name: res.user.name,
          username,
          role: res.user.role,
          center_id: res.user.center_id ?? null,
        });
      })
    );
  }

  logout(): void {
    this.http.post(`${API}/auth/logout`, {}).subscribe({ error: () => {} });
    localStorage.removeItem('token');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  hasRole(role: string | string[]): boolean {
    const r = this.currentUser()?.role;
    if (!r) return false;
    return Array.isArray(role) ? role.includes(r) : r === role;
  }
}
