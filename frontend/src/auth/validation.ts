import type { ContactType, LoginInput, RegisterInput } from '../types';

export interface LoginFormValues {
  login: string;
  password: string;
}

export type LoginField = keyof LoginFormValues;
export type LoginErrors = Partial<Record<LoginField, string>>;

export interface RegisterFormValues extends RegisterInput {
  confirmPassword: string;
}

export type RegisterField = keyof RegisterFormValues;
export type RegisterErrors = Partial<Record<RegisterField, string>>;

const LOGIN_PATTERN = /^[a-z0-9_]{3,20}$/i;
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s-]{1,49}$/;
const ROOM_PATTERN = /^\d{1,4}[A-Za-zА-Яа-яЁё]?$/;
const TELEGRAM_PATTERN = /^@?[A-Za-z0-9_]{5,32}$/;

export function validateLogin(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {};
  const login = values.login.trim();

  if (!login) {
    errors.login = 'Введите логин.';
  } else if (!LOGIN_PATTERN.test(login)) {
    errors.login = 'Логин: 3–20 символов, латиница, цифры и _.';
  }

  if (!values.password) {
    errors.password = 'Введите пароль.';
  }

  return errors;
}

export function validateRegister(values: RegisterFormValues): RegisterErrors {
  const errors: RegisterErrors = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const room = values.room.trim();
  const login = values.login.trim();
  const contact = values.contactValue.trim();

  if (!firstName) {
    errors.firstName = 'Введите имя.';
  } else if (!NAME_PATTERN.test(firstName)) {
    errors.firstName = 'Имя: 2–50 букв, дефис или пробел.';
  }

  if (!lastName) {
    errors.lastName = 'Введите фамилию.';
  } else if (!NAME_PATTERN.test(lastName)) {
    errors.lastName = 'Фамилия: 2–50 букв, дефис или пробел.';
  }

  if (!room) {
    errors.room = 'Введите номер комнаты.';
  } else if (!ROOM_PATTERN.test(room)) {
    errors.room = 'Комната: до 4 цифр и необязательная буква, например 314 или 12А.';
  }

  if (!contact) {
    errors.contactValue = 'Укажите контакт для связи.';
  } else if (values.contactType === 'phone' && !isValidPhone(contact)) {
    errors.contactValue = 'Телефон: 10–11 цифр, можно с +7.';
  } else if (values.contactType === 'telegram' && !TELEGRAM_PATTERN.test(contact)) {
    errors.contactValue = 'Telegram: 5–32 символа, латиница, цифры и _, можно с @.';
  } else if (values.contactType === 'vk' && !isValidVk(contact)) {
    errors.contactValue = 'VK: ссылка на профиль или короткое имя без пробелов.';
  }

  if (!login) {
    errors.login = 'Придумайте логин.';
  } else if (!LOGIN_PATTERN.test(login)) {
    errors.login = 'Логин: 3–20 символов, латиница, цифры и _.';
  }

  if (!values.password) {
    errors.password = 'Придумайте пароль.';
  } else if (values.password.length < 8) {
    errors.password = 'Пароль: минимум 8 символов.';
  } else if (values.password.length > 72) {
    errors.password = 'Пароль: не больше 72 символов.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Повторите пароль.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Пароли не совпадают.';
  }

  return errors;
}

export function normalizeLoginInput(values: LoginFormValues): LoginInput {
  return {
    login: values.login.trim().toLowerCase(),
    password: values.password,
  };
}

export function normalizeRegisterInput(values: RegisterFormValues): RegisterInput {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    room: values.room.trim().toUpperCase(),
    login: values.login.trim().toLowerCase(),
    contactType: values.contactType,
    contactValue: normalizeContact(values.contactType, values.contactValue),
    password: values.password,
  };
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 10) {
    return true;
  }

  return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'));
}

function isValidVk(value: string): boolean {
  if (/\s/.test(value) || value.length < 2 || value.length > 100) {
    return false;
  }

  if (!/^https?:\/\//i.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.hostname === 'vk.com' || url.hostname.endsWith('.vk.com');
  } catch {
    return false;
  }
}

function normalizeContact(type: ContactType, value: string): string {
  const trimmed = value.trim();

  if (type === 'phone') {
    const digits = trimmed.replace(/\D/g, '');

    if (digits.length === 10) {
      return `+7${digits}`;
    }

    if (digits.length === 11 && digits.startsWith('8')) {
      return `+7${digits.slice(1)}`;
    }

    if (digits.length === 11 && digits.startsWith('7')) {
      return `+${digits}`;
    }

    return trimmed;
  }

  if (type === 'telegram') {
    return `@${trimmed.replace(/^@/, '')}`;
  }

  return trimmed;
}
