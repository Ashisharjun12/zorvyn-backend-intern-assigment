import { ApiError } from '../../shared/ApiError.js';
import type { IUserService, IUserRepository, SafeUser } from './user.interface.js';
import type { UpdateUserDto, UpdateRoleDto, UpdateStatusDto, UserSelect } from './user.schema.js';


export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}
 
  //remove password from user object
  private toSafeUser(user: UserSelect): SafeUser {
    const { password: _pw, ...safe } = user;
    return safe as SafeUser;
  }

  //get all users
  async getAllUsers(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toSafeUser(user));
  }


  //get user by id
  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return this.toSafeUser(user);
  }


  //update user
  async updateUser(id: string, dto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    //check if email is changed or it is already in use
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw ApiError.badRequest('Email already in use');
      }
    }

    const updated = await this.userRepository.update(id, dto);
    return this.toSafeUser(updated);

  }

  //update user role
  async updateRole(id: string, dto: UpdateRoleDto): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
 
    const updated = await this.userRepository.update(id, { role: dto.role });
    return this.toSafeUser(updated);
  }

  //update user status
  async updateStatus(id: string, dto: UpdateStatusDto): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const updated = await this.userRepository.update(id, { status: dto.status });
    return this.toSafeUser(updated);
  }

  //soft delete user
  async softDeleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    await this.userRepository.softDelete(id);
  }
}
