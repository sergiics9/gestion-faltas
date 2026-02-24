import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, tap, catchError, of, startWith } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-admin-faltas',
  imports: [Header, RouterLink],
  templateUrl: './admin-faltas.html',
  styleUrl: './admin-faltas.scss',
})
export class AdminFaltas {
  private api = inject(ApiService);

  refresh$ = new Subject<void>();
  loading = signal(false);
  error = signal<string | null>(null);

  absences = toSignal(
    this.refresh$.pipe(
      startWith(undefined),
      tap(() => this.loading.set(true)),
      switchMap(() =>
        this.api.getAbsences().pipe(
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
        teacher_id: number;
        teacher: string;
        timeslot_id: number;
        start_time: string;
        end_time: string;
        date: string;
        note: string | null;
      }>,
    },
  );

  delete(id: number) {
    if (!confirm('¿Eliminar esta ausencia?')) return;
    this.api.deleteAbsence(id).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => this.error.set(e?.error?.message ?? 'Error'),
    });
  }

  formatTime(t: string): string {
    if (!t) return '-';
    const parts = String(t).split(':');
    return `${parts[0]}:${parts[1]}`;
  }
}
