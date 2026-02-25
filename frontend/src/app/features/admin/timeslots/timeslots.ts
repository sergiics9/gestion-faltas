import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const API = '/api/v1';

interface TimeSlot {
  id: number;
  center_id: number;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-timeslots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timeslots.html',
})
export class TimeslotsComponent {
  private http = inject(HttpClient);
  list = signal<TimeSlot[]>([]);
  centers: { id: number; name: string }[] = [];
  centerId: number | null = null;
  loading = signal(false);
  modalOpen = signal(false);
  editId = signal<number | null>(null);
  form = signal({ center_id: 0, start_time: '08:00', end_time: '09:00' });
  saving = signal(false);

  constructor() {
    this.http
      .get<{ id: number; name: string }[]>(`${API}/centers`)
      .subscribe((c: { id: number; name: string }[]) => (this.centers = c));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.http.get<TimeSlot[]>(`${API}/timeslots`).subscribe({
      next: (res: TimeSlot[]) => {
        this.list.set(res);
        if (res.length && this.centerId == null) this.centerId = res[0].center_id;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editId.set(null);
    this.form.set({
      center_id: this.centerId ?? this.centers[0]?.id ?? 0,
      start_time: '08:00',
      end_time: '09:00',
    });
    this.modalOpen.set(true);
  }

  openEdit(t: TimeSlot): void {
    this.editId.set(t.id);
    this.form.set({
      center_id: t.center_id,
      start_time: t.start_time.slice(0, 5),
      end_time: t.end_time.slice(0, 5),
    });
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  setForm(p: Partial<{ center_id: number; start_time: string; end_time: string }>): void {
    this.form.update((f: { center_id: number; start_time: string; end_time: string }) => ({
      ...f,
      ...p,
    }));
  }

  save(): void {
    const f = this.form();
    this.saving.set(true);
    const body = { ...f, start_time: f.start_time + ':00', end_time: f.end_time + ':00' };
    const id = this.editId();
    const req = id
      ? this.http.put(`${API}/timeslots/${id}`, body)
      : this.http.post(`${API}/timeslots`, body);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.close();
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(t: TimeSlot): void {
    if (!confirm(`¿Eliminar franja ${t.start_time}-${t.end_time}?`)) return;
    this.http.delete(`${API}/timeslots/${t.id}`).subscribe({ next: () => this.load() });
  }
}
