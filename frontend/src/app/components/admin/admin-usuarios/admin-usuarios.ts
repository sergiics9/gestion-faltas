import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, tap, catchError, of, startWith } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Header } from '../../shared/header/header';
import { UserRole } from '../../../interfaces/usuario';

@Component({
  selector: 'app-admin-usuarios',
  imports: [ReactiveFormsModule, Header, RouterLink],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.scss',
})
export class AdminUsuarios {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  refresh$ = new Subject<void>();
  loading = signal(false);
  error = signal<string | null>(null);
  editingId = signal<number | null>(null);

  allowedRoles = computed(() =>
    this.auth.hasRole('admin')
      ? ['admin', 'centeradmin', 'teacher', 'guard']
      : ['guard', 'teacher'],
  );

  users = toSignal(
    this.refresh$.pipe(
      startWith(undefined),
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.api.getUsers().pipe(
          tap(() => this.loading.set(false)),
          catchError((err) => {
            this.loading.set(false);
            this.error.set(err?.error?.message ?? 'Error');
            return of([]);
          }),
        ),
      ),
    ),
    {
      initialValue: [] as Array<{
        id: number;
        username: string;
        name: string;
        role: string;
        center_id: number | null;
      }>,
    },
  );

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.minLength(6)],
    name: ['', Validators.required],
    role: this.fb.control<UserRole>('teacher', Validators.required),
    center_id: this.fb.control<number | null>(null),
  });

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ username: '', password: '', name: '', role: 'teacher', center_id: null });
  }

  openEdit(u: {
    id: number;
    username: string;
    name: string;
    role: string;
    center_id: number | null;
  }) {
    this.editingId.set(u.id);
    this.form.patchValue({
      username: u.username,
      password: '',
      name: u.name,
      role: u.role as 'teacher' | 'guard',
      center_id: u.center_id,
    });
  }

  save() {
    this.error.set(null);
    const id = this.editingId();
    const val = this.form.getRawValue();
    if (!val.username || !val.name || !val.role) return;

    if (id) {
      const data: Record<string, unknown> = {
        username: val.username,
        name: val.name,
        role: val.role,
        center_id: val.center_id,
      };
      if (val.password) data['password'] = val.password;
      this.api.updateUser(id, data).subscribe({
        next: () => this.refresh$.next(),
        error: (e) => this.error.set(e?.error?.message ?? 'Error'),
      });
    } else {
      if (!val.password) {
        this.error.set('La contraseña es obligatoria');
        return;
      }
      this.api
        .createUser({
          username: val.username,
          password: val.password,
          name: val.name,
          role: val.role,
          center_id: val.center_id ?? undefined,
        })
        .subscribe({
          next: () => this.refresh$.next(),
          error: (e) => this.error.set(e?.error?.message ?? 'Error'),
        });
    }
  }

  delete(id: number) {
    if (!confirm('¿Eliminar usuario?')) return;
    this.api.deleteUser(id).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => this.error.set(e?.error?.message ?? 'Error'),
    });
  }
}
