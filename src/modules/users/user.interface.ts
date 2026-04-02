import type { UserSelect, UserInsert, UpdateUserDto, UpdateRoleDto, UpdateStatusDto } from './user.schema.js';

export type SafeUser = Omit<UserSelect, 'password'>;


// User repository interface
export interface IUserRepository {
  findAll():               Promise<UserSelect[]>;
  findById(id: string):    Promise<UserSelect | undefined>;
  create(data: UserInsert): Promise<UserSelect>;
  update(id: string, data: Partial<UserInsert>): Promise<UserSelect>;
  softDelete(id: string):  Promise<void>;
  findByEmail(email: string): Promise<UserSelect | undefined>;
}


// User service interface
export interface IUserService {
  getAllUsers(): Promise<SafeUser[]>;
  getUserById(id: string): Promise<SafeUser>;
  updateUser(id: string, dto: UpdateUserDto): Promise<SafeUser>;
  updateRole(id: string, dto: UpdateRoleDto): Promise<SafeUser>;
  updateStatus(id: string, dto: UpdateStatusDto): Promise<SafeUser>;
  softDeleteUser(id: string): Promise<void>;
}
