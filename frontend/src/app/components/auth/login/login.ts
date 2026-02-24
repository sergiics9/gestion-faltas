import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.error.set(null);
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.getRawValue();
    this.loading.set(true);
    this.auth.login({ username, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.ok) {
          const role = this.auth.currentRole();
          const redirect: Record<string, string> = {
            admin: '/app/admin',
            centeradmin: '/app/admin',
            teacher: '/app/dashboard',
            guard: '/app/guardias/panel',
          };
          this.router.navigate([redirect[role ?? ''] ?? '/app/guardias/panel']);
        } else {
          this.error.set(res.error ?? 'Error de autenticación');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error de conexión');
      },
    });
  }
}
