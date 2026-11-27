export type UserRole = 'student' | 'admin';

export type ContactType = 'phone' | 'telegram' | 'vk';

export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  room: string;
  contactType: ContactType;
  contactValue: string;
  role: UserRole;
  dormId: string;
}

export interface LoginInput {
  login: string;
  password: string;
}

export interface RegisterInput {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  room: string;
  contactType: ContactType;
  contactValue: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Machine, Slot and Booking will appear with the booking API contract in docs/api.md.
