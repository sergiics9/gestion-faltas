/**
 * Interfaces del backend (API v1).
 */

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: string;
    center_id: number | null;
  };
}

export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  center_id: number | null;
}

export interface Center {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface TimeSlot {
  id: number;
  name?: string;
  start_time: string;
  end_time: string;
  [key: string]: unknown;
}

export interface Classroom {
  id: number;
  name: string;
  center_id?: number;
  [key: string]: unknown;
}

export interface Subject {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface ScheduleEntry {
  id: number;
  [key: string]: unknown;
}

export interface Absence {
  id?: number;
  [key: string]: unknown;
}
