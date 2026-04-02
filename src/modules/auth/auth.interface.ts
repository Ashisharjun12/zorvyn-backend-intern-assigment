import type { RegisterDto, LoginDto, UserSelect, UserInsert } from '../users/user.schema.js';



export type SafeUser = Omit<UserSelect, 'password'>;


// auth payload interface
export interface AuthPayload {
  token: string;
  user:  SafeUser;
}


// auth repository interface
export interface IAuthRepository {
  findByEmail(email: string): Promise<UserSelect | undefined>;
  createUser(data: Pick<UserInsert, 'name' | 'email' | 'password'>): Promise<UserSelect>;
}


// auth service interface
export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthPayload>;
  login(dto: LoginDto):       Promise<AuthPayload>;
}

