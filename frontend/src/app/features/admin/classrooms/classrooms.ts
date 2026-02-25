import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const API = '/api/v1';

interface Classroom {
  id: number;
  center_id: number;
  name: string;
}

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classrooms.html',
})
export class ClassroomsComponent {
  private http = inject(HttpClient);
  list = signal<Classroom[]>([]);
  centers: { id: number; name: string }[] = [];
  loading = signal(false);
  modalOpen = signal(false);
  editId = signal<number | null>(null);
  form = signal({ center_id: 0, name: '' });
  saving = signal(false);

  constructor() {
    this.http
      .get<{ id: number; name: string }[]>(`${API}/centers`)
      .subscribe((c) => (this.centers = c));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.http.get<Classroom[]>(`${API}/classrooms`).subscribe({
      next: (res) => {
        this.list.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editId.set(null);
    this.form.set({ center_id: this.centers[0]?.id ?? 0, name: '' });
    this.modalOpen.set(true);
  }

  openEdit(r: Classroom): void {
    this.editId.set(r.id);
    this.form.set({ center_id: r.center_id, name: r.name });
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  setForm(p: Partial<{ center_id: number; name: string }>): void {
    this.form.update((f) => ({ ...f, ...p }));
  }

  save(): void {
    this.saving.set(true);
    const id = this.editId();
    const req = id
      ? this.http.put(`${API}/classrooms/${id}`, this.form())
      : this.http.post(`${API}/classrooms`, this.form());
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.close();
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(r: Classroom): void {
    if (!confirm(`¿Eliminar aula ${r.name}?`)) return;
    this.http.delete(`${API}/classrooms/${r.id}`).subscribe({ next: () => this.load() });
  }
}
