import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.register(userData);
  }
}
