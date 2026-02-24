import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {
  Subject,
  switchMap,
  concatMap,
  from,
  tap,
  catchError,
  of,
  combineLatest,
  startWith,
  filter,
  EMPTY,
} from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Header } from '../../shared/header/header';

interface SubmitPayload {
  dates: string[];
  fullDay: boolean;
  slots: number[];
  note?: string;
}

@Component({
  selector: 'app-profesor-falta-form',
  imports: [ReactiveFormsModule, Header],
  templateUrl: './profesor-falta-form.html',
  styleUrl: './profesor-falta-form.scss',
})
export class ProfesorFaltaForm {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  minDate = new Date().toISOString().slice(0, 10);

  form = this.fb.group({
    fullDay: [false],
    multipleDays: [false],
    dateFrom: [this.minDate, Validators.required],
    dateTo: [this.minDate],
    note: [''],
  });

  private submit$ = new Subject<SubmitPayload>();

  private submitResult = toSignal(
    this.submit$.pipe(
      switchMap((payload) => {
        const user = this.auth.user();
        if (!user?.id) return of({ ok: false, error: 'No autenticado' });

        this.loading.set(true);
        this.error.set(null);

        const requests: Array<{
          date: string;
          timeslot_id?: number;
          full_day: boolean;
          note?: string;
        }> = [];
        for (const date of payload.dates) {
          if (payload.fullDay) {
            requests.push({ date, full_day: true, note: payload.note });
          } else {
            for (const tid of payload.slots) {
              requests.push({ date, timeslot_id: tid, full_day: false, note: payload.note });
            }
          }
        }

        return from(requests).pipe(
          concatMap((r) =>
            this.api.createAbsence({
              teacher_id: user.id!,
              date: r.date,
              full_day: r.full_day,
              timeslot_id: r.timeslot_id,
              note: r.note,
            }),
          ),
          tap({
            complete: () => {
              this.loading.set(false);
              this.success.set(true);
              this.router.navigate(['/app/dashboard']);
            },
          }),
          catchError((err) => {
            this.loading.set(false);
            this.error.set(err?.error?.message ?? 'Error al registrar la falta');
            return EMPTY;
          }),
        );
      }),
      catchError(() => EMPTY),
    ),
    { initialValue: null },
  );

  private dateFrom$ = this.form
    .get('dateFrom')!
    .valueChanges.pipe(startWith(this.form.get('dateFrom')!.value));
  private userId$ = toObservable(computed(() => this.auth.user()?.id ?? null));

  scheduleData = toSignal(
    combineLatest([this.userId$, this.dateFrom$]).pipe(
      filter(([id]) => id != null),
      switchMap(([userId, date]) =>
        this.api
          .getTeacherScheduleDay(userId!, date || this.minDate)
          .pipe(catchError(() => of(null))),
      ),
    ),
    { initialValue: null },
  );

  entries = computed(() => this.scheduleData()?.entries ?? []);
  hasEntries = computed(() => this.entries().length > 0);

  selectedSlots = signal<number[]>([]);

  toggleSlot(timeslotId: number) {
    const slots = this.selectedSlots();
    if (slots.includes(timeslotId)) {
      this.selectedSlots.set(slots.filter((id) => id !== timeslotId));
    } else {
      this.selectedSlots.set([...slots, timeslotId]);
    }
  }

  isSelected(timeslotId: number) {
    return this.selectedSlots().includes(timeslotId);
  }

  getDatesInRange(): string[] {
    const from = this.form.get('dateFrom')?.value || this.minDate;
    const multiple = this.form.get('multipleDays')?.value ?? false;
    const to = multiple ? this.form.get('dateTo')?.value || from : from;
    const dates: string[] = [];
    let d = new Date(from);
    const end = new Date(to);
    const today = new Date(this.minDate);
    while (d <= end) {
      const dow = d.getDay();
      if (dow >= 1 && dow <= 5 && d >= today) {
        dates.push(d.toISOString().slice(0, 10));
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  }

  onSubmit() {
    this.error.set(null);
    const fullDay = this.form.get('fullDay')?.value ?? false;
    const dates = this.getDatesInRange();
    const note = this.form.get('note')?.value || undefined;

    if (dates.length === 0) {
      this.error.set('Selecciona al menos una fecha válida (L-V, hoy o futuro).');
      return;
    }

    if (!fullDay) {
      const slots = this.selectedSlots();
      if (slots.length === 0) {
        this.error.set('Selecciona al menos una hora.');
        return;
      }
    }

    this.submit$.next({
      dates,
      fullDay,
      slots: this.selectedSlots(),
      note,
    });
  }

  formatTime(t: string): string {
    if (!t) return '-';
    const parts = String(t).split(':');
    return `${parts[0]}:${parts[1]}`;
  }
}
