import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-sm" style="width: 100%; max-width: 380px;">
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">IES Pere Maria</h2>
          <p class="text-center text-muted small mb-3">Gestión de Faltas del Profesorado</p>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" formControlName="username" placeholder="Usuario" autocomplete="username" />
              @if (form.get('username')?.invalid && form.get('username')?.touched) {
                <div class="text-danger small">Introduce el usuario</div>
              }
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" formControlName="password" placeholder="Contraseña" autocomplete="current-password" />
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <div class="text-danger small">Introduce la contraseña</div>
              }
            </div>
            @if (errorMessage) {
              <div class="alert alert-danger py-2 small">{{ errorMessage }}</div>
            }
            <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid || loading">
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    this.auth.login(this.form.getRawValue().username, this.form.getRawValue().password).subscribe({
      next: () => {
        const role = this.auth.user()?.role;
        if (role === 'guard') this.router.navigate(['/guard']);
        else if (role === 'teacher') this.router.navigate(['/teacher']);
        else if (role === 'admin' || role === 'centeradmin') this.router.navigate(['/admin']);
        else this.router.navigate(['/guard']);
      },
      complete: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Usuario o contraseña incorrectos';
      },
    });
  }
}
