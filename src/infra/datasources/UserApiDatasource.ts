import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, LoginResponse } from '../../domain/entities/User';
import { config } from '../../config';

export class UserApiDatasource implements UserRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    const data: LoginResponse = await response.json();
    return data;
  }

  async register(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      console.log(`Erro ao criar usuário: ${response.statusText}`);
      
      throw new Error('Erro ao criar usuário');
    }

    const data: User = await response.json();
    return data;
  }
}
