import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class AuthenticateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<User | null> {
    return this.userRepository.getUserByCredentials(username, password);
  }
}
