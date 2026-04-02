import jwt from 'jsonwebtoken';

import { _config } from '../../config/config.js';
import { ApiError } from '../../shared/ApiError.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import type { RegisterDto, LoginDto, UserSelect } from '../users/user.schema.js';
import type { IAuthService, IAuthRepository, AuthPayload, SafeUser } from './auth.interface.js';


export class AuthService implements IAuthService {

  constructor(private readonly authRepository: IAuthRepository) {}

  //sign token
  private signToken(user: UserSelect): string {
    return jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      _config.JWT_SECRET!,
      { expiresIn: (_config.JWT_EXPIRES_IN ?? '7d') } as jwt.SignOptions
    );
  }


  //strip password hash
  private toSafeUser(user: UserSelect): SafeUser {
    const { password: _pw, ...safe } = user;
    return safe;
  }


  //register user
  async register(dto: RegisterDto): Promise<AuthPayload> {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw ApiError.badRequest('An account with this email already exists');
    }

    //hash password
    const hashed = await hashPassword(dto.password);

    //create user
    const user = await this.authRepository.createUser({
      name:     dto.name,
      email:    dto.email,
      password: hashed,
    });

    //sign token
    const token = this.signToken(user);
    return { token, user: this.toSafeUser(user) };
  }



// login user
  async login(dto: LoginDto): Promise<AuthPayload> {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    //check user status
    if (user.status === 'inactive') {
      throw ApiError.forbidden('Your account has been deactivated. Contact an administrator.');
    }

    //compare password
    const validpassword = await comparePassword(dto.password, user.password);
    if (!validpassword) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    //sign token
    const token = this.signToken(user);
    return { token, user: this.toSafeUser(user) };
  }



  
}
