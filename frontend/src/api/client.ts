const TOKEN_KEY = 'laundry.token';
const API_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fields?: Record<string, string>;

  constructor(
    status: number,
    message: string,
    options: { code?: string; fields?: Record<string, string> } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options.code;
    this.fields = options.fields;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Не удалось выполнить запрос. Проверьте соединение и попробуйте ещё раз.';
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, readMessage(payload) ?? 'Не удалось выполнить запрос.', {
      code: readString(payload, 'code'),
      fields: readFields(payload),
    });
  }

  return payload as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];
  return typeof field === 'string' ? field : undefined;
}

function readMessage(payload: unknown): string | undefined {
  return readString(payload, 'message') ?? readString(payload, 'error');
}

function readFields(payload: unknown): Record<string, string> | undefined {
  if (!isRecord(payload) || !isRecord(payload.fields)) {
    return undefined;
  }

  const fields = Object.entries(payload.fields).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  );

  return fields.length > 0 ? Object.fromEntries(fields) : undefined;
}
