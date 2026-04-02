import type { RegisterDto, LoginDto, UserSelect, UserInsert } from '../users/user.schema.js';

export type SafeUser = Omit<UserSelect, 'password'>;


// Auth payload interface
export interface AuthPayload {
  token: string;
  user:  SafeUser;
}


// Auth repository interface
export interface IAuthRepository {
  findByEmail(email: string): Promise<UserSelect | undefined>;
  findById(id: string):      Promise<UserSelect | undefined>;
  create(data: UserInsert):   Promise<UserSelect>;
}


// Auth service interface
export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthPayload>;
  login(dto: LoginDto): Promise<AuthPayload>;
}
