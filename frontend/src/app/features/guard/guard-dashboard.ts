import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

const API = '/api/v1';

interface AbsenceRow {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  teacher: string;
  classroom: string;
  subject: string;
  note: string | null;
}

interface GuardTodayResponse {
  date: string;
  absences: AbsenceRow[];
}

@Component({
  selector: 'app-guard-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-3">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h4 mb-0">Tablero de guardia — {{ date }}</h1>
        <div>
          <span class="me-3">{{ auth.user()?.name }}</span>
          <button type="button" class="btn btn-outline-secondary btn-sm" (click)="auth.logout()">
            Salir
          </button>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Ver fecha</label>
        <input
          type="date"
          class="form-control form-control-sm"
          style="max-width: 180px;"
          [value]="date"
          (change)="onDateChange($event)"
        />
      </div>

      @if (loading()) {
        <p class="text-muted">Cargando...</p>
      } @else if (absences().length === 0) {
        <div class="alert alert-info">No hay faltas registradas para este día.</div>
      } @else {
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th>Franja horaria</th>
                <th>Profesor ausente</th>
                <th>Aula</th>
                <th>Asignatura</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              @for (a of absences(); track a.id) {
                <tr>
                  <td>{{ a.start_time }} – {{ a.end_time }}</td>
                  <td>{{ a.teacher }}</td>
                  <td>{{ a.classroom }}</td>
                  <td>{{ a.subject }}</td>
                  <td>{{ a.note || '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class GuardDashboardComponent {
  private http = inject(HttpClient);
  auth = inject(AuthService);
  date = new Date().toISOString().slice(0, 10);
  absences = signal<AbsenceRow[]>([]);
  loading = signal(false);

  constructor() {
    this.load();
  }

  onDateChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (input.value) {
      this.date = input.value;
      this.load();
    }
  }

  load(): void {
    this.loading.set(true);
    this.http
      .get<GuardTodayResponse>(`${API}/guard/today`, { params: { date: this.date } })
      .subscribe({
        next: (res: GuardTodayResponse) => {
          this.date = res.date;
          this.absences.set(res.absences);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
