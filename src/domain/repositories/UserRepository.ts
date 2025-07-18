import { User, LoginResponse } from '../entities/User';

export interface UserRepository {
  login(email: string, password: string): Promise<LoginResponse>;
  register(user: Omit<User, 'id'>): Promise<User>;
}
