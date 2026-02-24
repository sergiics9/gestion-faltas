import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, tap, of } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import type { GuardTodayResponse } from '../../../interfaces/api';

@Component({
  selector: 'app-guardia-horario',
  imports: [],
  templateUrl: './guardia-horario.html',
  styleUrl: './guardia-horario.scss',
})
export class GuardiaHorario {
  private api = inject(ApiService);

  loading = signal(true);
  error = signal<string | null>(null);

  data = toSignal(
    this.api.getGuardToday().pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Error al cargar ausencias');
        return of(null);
      }),
    ),
    { initialValue: null as GuardTodayResponse | null },
  );

  formatTime(t: string): string {
    if (!t) return '-';
    const parts = String(t).split(':');
    return `${parts[0]}:${parts[1]}`;
  }
}
