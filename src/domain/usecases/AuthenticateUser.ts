import { UserRepository } from '../repositories/UserRepository';
import { LoginResponse } from '../entities/User';

export class AuthenticateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    return this.userRepository.login(email, password);
  }
}
