import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const API = '/api/v1';

interface ScheduleEntry {
  id: number;
  teacher_id: number;
  day_of_week: number;
  timeslot_id: number;
  classroom_id: number;
  subject_id: number;
  teacher?: { id: number; name: string };
  timeslot?: { id: number; start_time: string; end_time: string };
  classroom?: { id: number; name: string };
  subject?: { id: number; name: string };
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedules.html',
})
export class SchedulesComponent {
  private http = inject(HttpClient);
  list = signal<ScheduleEntry[]>([]);
  teachers: { id: number; name: string }[] = [];
  timeslots: { id: number; start_time: string; end_time: string }[] = [];
  classrooms: { id: number; name: string }[] = [];
  subjects: { id: number; name: string }[] = [];
  loading = signal(false);
  modalOpen = signal(false);
  editId = signal<number | null>(null);
  errorMessage = signal<string | null>(null);
  form = signal({ teacher_id: 0, day_of_week: 1, timeslot_id: 0, classroom_id: 0, subject_id: 0 });
  days = [
    { v: 1, label: 'Lunes' },
    { v: 2, label: 'Martes' },
    { v: 3, label: 'Miércoles' },
    { v: 4, label: 'Jueves' },
    { v: 5, label: 'Viernes' },
  ];
  saving = signal(false);

  constructor() {
    this.http
      .get<{ data: { id: number; name: string }[] }>(`${API}/users?role=teacher`)
      .subscribe((r: { data: { id: number; name: string }[] }) => (this.teachers = r.data));
    this.http
      .get<{ id: number; start_time: string; end_time: string }[]>(`${API}/timeslots`)
      .subscribe(
        (t: { id: number; start_time: string; end_time: string }[]) => (this.timeslots = t),
      );
    this.http
      .get<{ id: number; name: string }[]>(`${API}/classrooms`)
      .subscribe((c: { id: number; name: string }[]) => (this.classrooms = c));
    this.http
      .get<{ id: number; name: string }[]>(`${API}/subjects`)
      .subscribe((s: { id: number; name: string }[]) => (this.subjects = s));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.http.get<ScheduleEntry[]>(`${API}/schedule-entries`).subscribe({
      next: (res: ScheduleEntry[]) => {
        this.list.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.errorMessage.set(null);
    this.editId.set(null);
    this.form.set({
      teacher_id: this.teachers[0]?.id ?? 0,
      day_of_week: 1,
      timeslot_id: this.timeslots[0]?.id ?? 0,
      classroom_id: this.classrooms[0]?.id ?? 0,
      subject_id: this.subjects[0]?.id ?? 0,
    });
    this.modalOpen.set(true);
  }

  openEdit(e: ScheduleEntry): void {
    this.errorMessage.set(null);
    this.editId.set(e.id);
    this.form.set({
      teacher_id: e.teacher_id,
      day_of_week: e.day_of_week,
      timeslot_id: e.timeslot_id,
      classroom_id: e.classroom_id,
      subject_id: e.subject_id,
    });
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  setForm(
    p: Partial<{
      teacher_id: number;
      day_of_week: number;
      timeslot_id: number;
      classroom_id: number;
      subject_id: number;
    }>,
  ): void {
    this.form.update(
      (f: {
        teacher_id: number;
        day_of_week: number;
        timeslot_id: number;
        classroom_id: number;
        subject_id: number;
      }) => ({ ...f, ...p }),
    );
  }

  private friendlySaveError(err: HttpErrorResponse): string {
    const raw =
      err?.error?.message ??
      (typeof err?.error === 'string' ? err.error : null) ??
      err?.message ??
      '';
    const s = String(raw).toLowerCase();
    if (
      s.includes('duplicate entry') ||
      s.includes('integrity constraint') ||
      s.includes('uk_teacher_slot_day') ||
      s.includes('sqlstate')
    ) {
      return 'Ese profesor ya tiene una clase asignada en ese día y franja horaria. Elija otro día, otra franja o otro profesor.';
    }
    if (raw && raw.length < 120 && !raw.includes('sql') && !raw.includes('insert into')) {
      return raw;
    }
    return 'No se pudo guardar. Compruebe que el profesor, aula o franja no estén ya ocupados.';
  }

  save(): void {
    this.saving.set(true);
    this.errorMessage.set(null);
    const id = this.editId();
    const req = id
      ? this.http.put(`${API}/schedule-entries/${id}`, this.form())
      : this.http.post(`${API}/schedule-entries`, this.form());
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.close();
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.errorMessage.set(this.friendlySaveError(err));
      },
    });
  }

  delete(e: ScheduleEntry): void {
    if (!confirm('¿Eliminar esta entrada de horario?')) return;
    this.http.delete(`${API}/schedule-entries/${e.id}`).subscribe({ next: () => this.load() });
  }

  dayLabel(dow: number): string {
    return this.days.find((x) => x.v === dow)?.label ?? '';
  }
}
