import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const API = '/api/v1';

interface Subject {
  id: number;
  center_id: number;
  name: string;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjects.html',
})
export class SubjectsComponent implements OnInit {
  list = signal<Subject[]>([]);
  centers: { id: number; name: string }[] = [];
  loading = signal(false);
  modalOpen = signal(false);
  editId = signal<number | null>(null);
  form = signal({ center_id: 0, name: '' });
  saving = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<{ id: number; name: string }[]>(`${API}/centers`)
      .subscribe((c) => (this.centers = c));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.http.get<Subject[]>(`${API}/subjects`).subscribe({
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

  openEdit(s: Subject): void {
    this.editId.set(s.id);
    this.form.set({ center_id: s.center_id, name: s.name });
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
      ? this.http.put(`${API}/subjects/${id}`, this.form())
      : this.http.post(`${API}/subjects`, this.form());
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.close();
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(s: Subject): void {
    if (!confirm(`¿Eliminar asignatura ${s.name}?`)) return;
    this.http.delete(`${API}/subjects/${s.id}`).subscribe({ next: () => this.load() });
  }
}
