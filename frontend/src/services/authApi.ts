import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/Auth';
import { setToken, removeToken } from '../utils/token';

const API_BASE_URL = 'http://localhost:5000/api/auth';

class AuthApiService {
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: AuthResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to register');
    }

    setToken(result.data.token);
    return result.data;
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result: AuthResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to login');
    }

    setToken(result.data.token);
    return result.data;
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('bmpl_auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get user');
    }

    return result.data;
  }

  logout(): void {
    removeToken();
  }
}

export const authApi = new AuthApiService();

