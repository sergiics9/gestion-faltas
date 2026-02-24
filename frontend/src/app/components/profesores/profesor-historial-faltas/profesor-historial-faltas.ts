import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, startWith, tap } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Header } from '../../shared/header/header';

export interface AbsenceWithTime {
  id: number;
  teacher_id: number;
  teacher: string;
  timeslot_id: number;
  start_time: string;
  end_time: string;
  date: string;
  note: string | null;
}

@Component({
  selector: 'app-profesor-historial-faltas',
  standalone: true,
  templateUrl: './profesor-historial-faltas.html',
  styleUrls: ['./profesor-historial-faltas.scss'],
  imports: [Header],
})
export class ProfesorHistorialFaltas {
  private api = inject(ApiService);

  loading = signal(false);
  error = signal<string | null>(null);

  // Señal que contiene las faltas
  absences = toSignal<AbsenceWithTime[]>(
    this.api.getAbsences().pipe(
      tap(() => this.loading.set(true)),
      catchError((err) => {
        this.error.set(err?.error?.message ?? 'Error cargando faltas');
        return of([]);
      }),
      tap(() => this.loading.set(false)),
      startWith([]),
    ),
  );

  formatTime(time: string): string {
    return time?.slice(0, 5); // ejemplo: "14:30"
  }
}
