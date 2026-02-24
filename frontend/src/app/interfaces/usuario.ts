export type UserRole = 'admin' | 'centeradmin' | 'teacher' | 'guard';

export interface Usuario {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  center_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}
