import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, tap, catchError, of, startWith } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Header } from '../../shared/header/header';
import type { ScheduleEntry, TimeSlot, Classroom, Subject } from '../../../interfaces/api';

@Component({
  selector: 'app-admin-horario',
  imports: [Header, RouterLink],
  templateUrl: './admin-horario.html',
  styleUrl: './admin-horario.scss',
})
export class AdminHorario {
  private api = inject(ApiService);

  refresh$ = new Subject<void>();
  loading = signal(false);
  error = signal<string | null>(null);

  data = toSignal(
    this.refresh$.pipe(
      startWith(undefined),
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.api.getScheduleEntries().pipe(
          tap(() => this.loading.set(false)),
          catchError((err) => {
            this.loading.set(false);
            this.error.set(err?.error?.message ?? 'Error');
            return of([]);
          })
        )
      )
    ),
    { initialValue: [] as ScheduleEntry[] }
  );

}
