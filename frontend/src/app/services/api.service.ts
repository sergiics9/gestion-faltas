import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import type {
  Center,
  TimeSlot,
  Classroom,
  Subject,
  ScheduleEntry,
  Absence,
  GuardTodayResponse,
  CreateAbsenceRequest,
} from '../interfaces/api';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Auth (ya en AuthService, pero para consistencia)
  // Centers
  getCenters(): Observable<Center[]> {
    return this.http.get<Center[]>(`${API}/centers`);
  }
  getCenter(id: number): Observable<Center> {
    return this.http.get<Center>(`${API}/centers/${id}`);
  }
  createCenter(data: Pick<Center, 'name'>): Observable<Center> {
    return this.http.post<Center>(`${API}/centers`, data);
  }
  updateCenter(id: number, data: Pick<Center, 'name'>): Observable<Center> {
    return this.http.put<Center>(`${API}/centers/${id}`, data);
  }
  deleteCenter(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/centers/${id}`);
  }

  // TimeSlots
  getTimeSlots(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${API}/timeslots`);
  }
  getTimeSlot(id: number): Observable<TimeSlot> {
    return this.http.get<TimeSlot>(`${API}/timeslots/${id}`);
  }
  createTimeSlot(data: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(`${API}/timeslots`, data);
  }
  updateTimeSlot(id: number, data: Partial<TimeSlot>): Observable<TimeSlot> {
    return this.http.put<TimeSlot>(`${API}/timeslots/${id}`, data);
  }
  deleteTimeSlot(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/timeslots/${id}`);
  }

  // Classrooms
  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${API}/classrooms`);
  }
  createClassroom(data: Omit<Classroom, 'id' | 'created_at' | 'updated_at'>): Observable<Classroom> {
    return this.http.post<Classroom>(`${API}/classrooms`, data);
  }
  updateClassroom(id: number, data: Partial<Classroom>): Observable<Classroom> {
    return this.http.put<Classroom>(`${API}/classrooms/${id}`, data);
  }
  deleteClassroom(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/classrooms/${id}`);
  }

  // Subjects
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${API}/subjects`);
  }
  createSubject(data: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Observable<Subject> {
    return this.http.post<Subject>(`${API}/subjects`, data);
  }
  updateSubject(id: number, data: Partial<Subject>): Observable<Subject> {
    return this.http.put<Subject>(`${API}/subjects/${id}`, data);
  }
  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/subjects/${id}`);
  }

  // ScheduleEntries
  getScheduleEntries(): Observable<ScheduleEntry[]> {
    return this.http.get<ScheduleEntry[]>(`${API}/schedule-entries`);
  }
  getScheduleEntry(id: number): Observable<ScheduleEntry> {
    return this.http.get<ScheduleEntry>(`${API}/schedule-entries/${id}`);
  }
  createScheduleEntry(data: Omit<ScheduleEntry, 'id' | 'created_at' | 'updated_at'>): Observable<ScheduleEntry> {
    return this.http.post<ScheduleEntry>(`${API}/schedule-entries`, data);
  }
  updateScheduleEntry(id: number, data: Partial<ScheduleEntry>): Observable<ScheduleEntry> {
    return this.http.put<ScheduleEntry>(`${API}/schedule-entries/${id}`, data);
  }
  deleteScheduleEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/schedule-entries/${id}`);
  }

  // Teacher schedule for a day
  getTeacherScheduleDay(teacherId: number, date: string): Observable<{
    teacher: { id: number; name: string };
    date: string;
    day_of_week: number;
    entries: Array<{
      schedule_entry_id: number;
      timeslot_id: number;
      start_time: string;
      end_time: string;
      classroom: string;
      subject: string;
      is_absent: boolean;
    }>;
  }> {
    return this.http.get<unknown>(`${API}/teachers/${teacherId}/schedule/day`, {
      params: { date },
    }) as Observable<{
      teacher: { id: number; name: string };
      date: string;
      day_of_week: number;
      entries: Array<{
        schedule_entry_id: number;
        timeslot_id: number;
        start_time: string;
        end_time: string;
        classroom: string;
        subject: string;
        is_absent: boolean;
      }>;
    }>;
  }

  // Absences
  getAbsences(): Observable<
    Array<{
      id: number;
      teacher_id: number;
      teacher: string;
      timeslot_id: number;
      start_time: string;
      end_time: string;
      date: string;
      note: string | null;
    }>
  > {
    return this.http.get<
      Array<{
        id: number;
        teacher_id: number;
        teacher: string;
        timeslot_id: number;
        start_time: string;
        end_time: string;
        date: string;
        note: string | null;
      }>
    >(`${API}/absences`);
  }
  createAbsence(data: CreateAbsenceRequest): Observable<Absence | { message: string; created: number }> {
    return this.http.post<Absence | { message: string; created: number }>(`${API}/absences`, data);
  }
  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/absences/${id}`);
  }

  // Users (admin / centeradmin)
  getUsers(): Observable<
    Array<{ id: number; username: string; name: string; role: string; center_id: number | null }>
  > {
    return this.http.get<Array<{ id: number; username: string; name: string; role: string; center_id: number | null }>>(
      `${API}/users`
    );
  }
  createUser(data: {
    username: string;
    password: string;
    name: string;
    role: string;
    center_id?: number | null;
  }): Observable<{ id: number; username: string; name: string; role: string; center_id: number | null }> {
    return this.http.post<{
      id: number;
      username: string;
      name: string;
      role: string;
      center_id: number | null;
    }>(`${API}/users`, data);
  }
  updateUser(
    id: number,
    data: Partial<{ username: string; password: string; name: string; role: string; center_id: number | null }>
  ): Observable<{ id: number; username: string; name: string; role: string; center_id: number | null }> {
    return this.http.put<{
      id: number;
      username: string;
      name: string;
      role: string;
      center_id: number | null;
    }>(`${API}/users/${id}`, data);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/users/${id}`);
  }

  // Guard
  getGuardToday(): Observable<GuardTodayResponse> {
    return this.http.get<GuardTodayResponse>(`${API}/guard/today`);
  }
}
