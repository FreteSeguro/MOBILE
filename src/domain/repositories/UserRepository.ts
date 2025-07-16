import { User } from '../entities/User';

export interface UserRepository {
  getUserByCredentials(username: string, password: string): Promise<User | null>;
}
