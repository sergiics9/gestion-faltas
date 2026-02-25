import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const API = '/api/v1';

interface UserItem {
  id: number;
  name: string;
  username: string;
  role: string;
  center_id: number | null;
  center?: string;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers.html',
})
export class TeachersComponent {
  private http = inject(HttpClient);
  list = signal<UserItem[]>([]);
  loading = signal(false);
  modalOpen = signal(false);
  editId = signal<number | null>(null);
  form = signal({ username: '', password: '', name: '', role: 'teacher' as string });
  roles = ['admin', 'centeradmin', 'teacher', 'guard'];
  saving = signal(false);
  error = signal('');

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.http.get<{ data: UserItem[] }>(`${API}/users`).subscribe({
      next: (res: { data: UserItem[] }) => {
        this.list.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editId.set(null);
    this.form.set({ username: '', password: '', name: '', role: 'teacher' });
    this.error.set('');
    this.modalOpen.set(true);
  }

  openEdit(u: UserItem): void {
    this.editId.set(u.id);
    this.form.set({ username: u.username, password: '', name: u.name, role: u.role });
    this.error.set('');
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  setForm(p: Partial<{ username: string; password: string; name: string; role: string }>): void {
    this.form.update((f: { username: string; password: string; name: string; role: string }) => ({
      ...f,
      ...p,
    }));
  }

  save(): void {
    const f = this.form();
    this.error.set('');
    this.saving.set(true);
    const body: Record<string, unknown> = {
      username: f.username,
      name: f.name,
      role: f.role,
    };
    if (f.password) body['password'] = f.password;

    const id = this.editId();
    const req = id
      ? this.http.put(`${API}/users/${id}`, body)
      : this.http.post(`${API}/users`, body);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.close();
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || err?.message || 'Error al guardar');
      },
    });
  }

  delete(u: UserItem): void {
    if (!confirm(`¿Eliminar a ${u.name}?`)) return;
    this.http.delete(`${API}/users/${u.id}`).subscribe({
      next: () => this.load(),
      error: (e: HttpErrorResponse) => alert(e?.error?.message || 'Error al eliminar'),
    });
  }
}
