import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { BASE_URL } from '@env';

export class UserApiDatasource implements UserRepository {
  async getUserByCredentials(username: string, password: string): Promise<User | null> {
    const res = await fetch(`${BASE_URL}/users?username=${username}&password=${password}`);
    const users: User[] = await res.json();
    return users.length > 0 ? users[0] : null;
  }
}
