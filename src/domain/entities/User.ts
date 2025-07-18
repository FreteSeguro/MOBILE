import { Vehicle } from './Vehicle';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string | null;
  createdAt?: string;
  vehicles?: Vehicle[];
}

export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string | null;
}

export interface AuthUser {
  token: string;
  user: User;
}