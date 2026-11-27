import type { AuthResponse, LoginInput, RegisterInput, User } from '../types';
import { clearToken, setToken } from './client';
import { mockGetMe, mockLogin, mockRegister } from './mocks';

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await mockLogin(input.login, input.password);
  setToken(response.token);
  return response;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await mockRegister(input);
  setToken(response.token);
  return response;
}

export async function getMe(): Promise<User> {
  return mockGetMe();
}

export function logout(): void {
  clearToken();
}
