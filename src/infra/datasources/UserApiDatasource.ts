import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, LoginResponse } from '../../domain/entities/User';

const API_BASE_URL = 'http://192.168.1.90:8080';

export class UserApiDatasource implements UserRepository {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
