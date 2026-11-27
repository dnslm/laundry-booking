import type { AuthResponse, RegisterInput, User, UserRole } from '../types';
import { ApiError, getToken } from './client';

interface MockAccount {
  user: User;
  password: string;
}

const USERS_KEY = 'laundry.mock.users.v1';
const TOKEN_PREFIX = 'mock:';
const DEFAULT_DORM_ID = 'dorm-1';
const DELAY_MS = 350;

const DEMO_ACCOUNTS: MockAccount[] = [
  {
    password: 'student123',
    user: {
      id: 'usr_student',
      login: 'student',
      firstName: 'Иван',
      lastName: 'Петров',
      room: '314',
      contactType: 'telegram',
      contactValue: '@ivan_petrov',
      role: 'student',
      dormId: DEFAULT_DORM_ID,
    },
  },
  {
    password: 'admin123',
    user: {
      id: 'usr_admin',
      login: 'admin',
      firstName: 'Анна',
      lastName: 'Смирнова',
      room: '101',
      contactType: 'phone',
      contactValue: '+79000000002',
      role: 'admin',
      dormId: DEFAULT_DORM_ID,
    },
  },
];

export const DEMO_CREDENTIALS: ReadonlyArray<{
  login: string;
  password: string;
  role: UserRole;
}> = DEMO_ACCOUNTS.map(({ user, password }) => ({
  login: user.login,
  password,
  role: user.role,
}));

export async function mockLogin(login: string, password: string): Promise<AuthResponse> {
  await wait(DELAY_MS);

  const normalizedLogin = login.trim().toLowerCase();
  const account = readAccounts().find((item) => item.user.login.toLowerCase() === normalizedLogin);

  if (!account || account.password !== password) {
    throw new ApiError(401, 'Неверный логин или пароль.', { code: 'invalid_credentials' });
  }

  return { token: createMockToken(account.user.id), user: account.user };
}

export async function mockRegister(input: RegisterInput): Promise<AuthResponse> {
  await wait(DELAY_MS);

  const accounts = readAccounts();
  const normalizedLogin = input.login.trim().toLowerCase();

  if (accounts.some((item) => item.user.login.toLowerCase() === normalizedLogin)) {
    throw new ApiError(409, 'Этот логин уже занят.', {
      code: 'login_taken',
      fields: { login: 'Этот логин уже занят.' },
    });
  }

  const user: User = {
    id: createUserId(),
    login: normalizedLogin,
    firstName: input.firstName,
    lastName: input.lastName,
    room: input.room,
    contactType: input.contactType,
    contactValue: input.contactValue,
    role: 'student',
    dormId: DEFAULT_DORM_ID,
  };

  writeAccounts([...accounts, { user, password: input.password }]);

  return { token: createMockToken(user.id), user };
}

export async function mockGetMe(): Promise<User> {
  const token = getToken();
  const userId = token ? parseMockToken(token) : null;

  if (!userId) {
    throw new ApiError(401, 'Требуется вход.', { code: 'unauthorized' });
  }

  await wait(150);

  const account = readAccounts().find((item) => item.user.id === userId);

  if (!account) {
    throw new ApiError(401, 'Сессия истекла. Войдите снова.', { code: 'unauthorized' });
  }

  return account.user;
}

function readAccounts(): MockAccount[] {
  const stored = localStorage.getItem(USERS_KEY);

  if (!stored) {
    const seeded = cloneAccounts(DEMO_ACCOUNTS);
    writeAccounts(seeded);
    return seeded;
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid mock storage');
    }

    const accounts = parsed.filter(isMockAccount);

    if (accounts.length === 0) {
      throw new Error('Empty mock storage');
    }

    return accounts;
  } catch {
    const seeded = cloneAccounts(DEMO_ACCOUNTS);
    writeAccounts(seeded);
    return seeded;
  }
}

function writeAccounts(accounts: MockAccount[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

function cloneAccounts(accounts: MockAccount[]): MockAccount[] {
  return accounts.map((account) => ({
    password: account.password,
    user: { ...account.user },
  }));
}

function isMockAccount(value: unknown): value is MockAccount {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.password === 'string' && isUser(value.user);
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) {
    return false;
  }

  const contactType = value.contactType;

  return (
    typeof value.id === 'string' &&
    typeof value.login === 'string' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.room === 'string' &&
    (contactType === 'phone' || contactType === 'telegram' || contactType === 'vk') &&
    typeof value.contactValue === 'string' &&
    (value.role === 'student' || value.role === 'admin') &&
    typeof value.dormId === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function createMockToken(userId: string): string {
  return `${TOKEN_PREFIX}${userId}`;
}

function parseMockToken(token: string): string | null {
  return token.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : null;
}

function createUserId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `usr_${crypto.randomUUID()}`;
  }

  return `usr_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
