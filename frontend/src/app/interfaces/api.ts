// Center
export interface Center {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// TimeSlot
export interface TimeSlot {
  id: number;
  center_id: number;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
}

// Classroom
export interface Classroom {
  id: number;
  center_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Subject
export interface Subject {
  id: number;
  center_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// ScheduleEntry (con relaciones)
export interface ScheduleEntry {
  id: number;
  teacher_id: number;
  day_of_week: number;
  timeslot_id: number;
  classroom_id: number;
  subject_id: number;
  timeslot?: TimeSlot;
  classroom?: Classroom;
  subject?: Subject;
  teacher?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
}

// Absence
export interface Absence {
  id: number;
  teacher_id: number;
  timeslot_id: number;
  date: string;
  note: string | null;
  created_at?: string;
  updated_at?: string;
}

// Respuesta guard/today
export interface GuardTodayAbsence {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  teacher: string;
  note: string | null;
  classroom?: string;
  subject?: string;
}

export interface GuardTodayResponse {
  date: string;
  absences: GuardTodayAbsence[];
}

// Request crear ausencia
export interface CreateAbsenceRequest {
  teacher_id: number;
  date: string;
  timeslot_id?: number;
  full_day?: boolean;
  note?: string;
}
