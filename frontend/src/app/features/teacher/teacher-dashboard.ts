import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

const API = '/api/v1';

interface DayEntry {
  schedule_entry_id: number;
  timeslot_id: number;
  start_time: string;
  end_time: string;
  classroom: string;
  subject: string;
  is_absent: boolean;
  absence_id?: number;
  absence_note?: string | null;
}

interface ScheduleDayResponse {
  teacher: { id: number; name: string };
  date: string;
  day_of_week: number;
  entries: DayEntry[];
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.html',
})
export class TeacherDashboardComponent implements OnInit {
  current = signal<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  selectedDate = signal<string | null>(null);
  schedule = signal<ScheduleDayResponse | null>(null);
  loading = signal(false);
  pendingChecks = signal<Record<number, boolean>>({});
  pendingNote = signal<Record<number, string>>({});
  showConfirm = signal(false);
  saving = signal(false);

  calendarDays = computed(() => {
    const { year, month } = this.current();
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const startPad = (first.getDay() + 6) % 7;
    const days: { day: number; dateStr: string; isPast: boolean; isWeekend: boolean }[] = [];
    for (let i = 0; i < startPad; i++)
      days.push({ day: 0, dateStr: '', isPast: true, isWeekend: true });
    const today = new Date().toISOString().slice(0, 10);
    for (let d = 1; d <= last.getDate(); d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dow = new Date(year, month - 1, d).getDay();
      const isWeekend = dow === 0 || dow === 6;
      days.push({
        day: d,
        dateStr,
        isPast: dateStr < today || isWeekend,
        isWeekend,
      });
    }
    return days;
  });

  entries = computed(() => this.schedule()?.entries ?? []);
  hasPending = computed(() => {
    const checks = this.pendingChecks();
    const scheduleEntries = this.schedule()?.entries ?? [];
    for (const e of scheduleEntries) {
      const wasAbsent = e.is_absent;
      const nowChecked = !!checks[e.timeslot_id];
      if (nowChecked && !wasAbsent) return true;
      if (!nowChecked && wasAbsent) return true;
    }
    return false;
  });

  constructor(
    public auth: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const dow = today.getDay();
    if (dow >= 1 && dow <= 5) this.selectDate(todayStr);
  }

  prevMonth(): void {
    const { year, month } = this.current();
    if (month === 1) this.current.set({ year: year - 1, month: 12 });
    else this.current.set({ year, month: month - 1 });
  }

  nextMonth(): void {
    const { year, month } = this.current();
    if (month === 12) this.current.set({ year: year + 1, month: 1 });
    else this.current.set({ year, month: month + 1 });
  }

  monthLabel(): string {
    const { year, month } = this.current();
    return new Date(year, month - 1, 1).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  selectDate(dateStr: string): void {
    const day = this.calendarDays().find((x) => x.dateStr === dateStr);
    if (day?.isPast) return;
    this.selectedDate.set(dateStr);
    this.pendingChecks.set({});
    this.pendingNote.set({});
    this.loadDay(dateStr);
  }

  loadDay(dateStr: string): void {
    const teacherId = this.auth.user()?.id;
    if (!teacherId) return;
    this.loading.set(true);
    this.http
      .get<ScheduleDayResponse>(`${API}/teachers/${teacherId}/schedule/day`, {
        params: { date: dateStr },
      })
      .subscribe({
        next: (res) => {
          this.schedule.set(res);
          const init: Record<number, boolean> = {};
          res.entries.forEach((e) => (init[e.timeslot_id] = e.is_absent));
          this.pendingChecks.set(init);
          const notes: Record<number, string> = {};
          res.entries.forEach((e) => (notes[e.timeslot_id] = e.absence_note ?? ''));
          this.pendingNote.set(notes);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  toggleAllDay(checked: boolean): void {
    const entries = this.entries();
    const next: Record<number, boolean> = {};
    entries.forEach((e) => (next[e.timeslot_id] = checked));
    this.pendingChecks.set(next);
  }

  allDayChecked(): boolean {
    const entries = this.entries();
    if (entries.length === 0) return false;
    const checks = this.pendingChecks();
    return entries.every((e) => !!checks[e.timeslot_id]);
  }

  setCheck(timeslotId: number, checked: boolean): void {
    this.pendingChecks.update((m) => ({ ...m, [timeslotId]: checked }));
  }

  setNote(timeslotId: number, note: string): void {
    this.pendingNote.update((m) => ({ ...m, [timeslotId]: note }));
  }

  openConfirm(): void {
    this.showConfirm.set(true);
  }

  cancelConfirm(): void {
    this.showConfirm.set(false);
  }

  submitAbsences(): void {
    const dateStr = this.selectedDate();
    if (!dateStr) return;
    const teacherId = this.auth.user()?.id;
    if (!teacherId) return;
    const checks = this.pendingChecks();
    const notes = this.pendingNote();
    const entries = this.entries();
    const scheduleEntries = this.schedule()?.entries ?? [];
    const toAdd = entries.filter(
      (e) =>
        checks[e.timeslot_id] &&
        !scheduleEntries.find((x) => x.timeslot_id === e.timeslot_id)?.is_absent,
    );
    const toRemove = entries.filter(
      (e) =>
        !checks[e.timeslot_id] &&
        scheduleEntries.find((x) => x.timeslot_id === e.timeslot_id)?.absence_id,
    );

    this.saving.set(true);
    const postReqs = toAdd.map((e) =>
      this.http.post(API + '/absences', {
        teacher_id: teacherId,
        date: dateStr,
        timeslot_id: e.timeslot_id,
        note: notes[e.timeslot_id] || null,
      }),
    );
    const deleteReqs: ReturnType<HttpClient['delete']>[] = [];
    for (const e of toRemove) {
      const entry = scheduleEntries.find((x) => x.timeslot_id === e.timeslot_id);
      if (entry?.absence_id)
        deleteReqs.push(this.http.delete(`${API}/absences/${entry.absence_id}`));
    }

    const all = [
      ...postReqs.map((r) => firstValueFrom(r)),
      ...deleteReqs.map((r) => firstValueFrom(r)),
    ];
    Promise.all(all)
      .then(() => {
        this.showConfirm.set(false);
        this.loadDay(dateStr);
        import('sweetalert2').then((Swal) =>
          Swal.default.fire({ icon: 'success', title: 'Cambios guardados', timer: 2000 }),
        );
      })
      .catch(() =>
        import('sweetalert2').then((Swal) =>
          Swal.default.fire({ icon: 'error', title: 'Error al guardar' }),
        ),
      )
      .finally(() => this.saving.set(false));
  }
}
