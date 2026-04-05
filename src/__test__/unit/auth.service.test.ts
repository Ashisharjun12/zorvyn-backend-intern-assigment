import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../../modules/auth/auth.service.js';

// mock password utility
vi.mock('../../utils/hash.js', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
  comparePassword: vi.fn().mockResolvedValue(true) 
}));

describe('AuthService Test', () => {

    //register user
  it('should register a new user successfully', async () => {
   
    // mock repository
    const mockRepository = {
      findByEmail: vi.fn().mockResolvedValue(null), 
      create: vi.fn().mockResolvedValue({
        id: '123',
        name: 'Ashish',
        email: 'test@gmail.com'
      })
    };

  //auth service instance
    const authService = new AuthService(mockRepository as any);

    const userData = {
      name: 'Ashish',
      email: 'test@gmail.com',
      password: 'test21@A'
    };

    // Act 
    const result = await authService.register(userData);

    // Assert
    expect(result.user.name).toBe('Ashish');
    expect(result.user.email).toBe('test@gmail.com');
    expect(result).toHaveProperty('token'); 
  });




  //login user

  it('should login a user successfully', async () => {
    //Arrange
    const mockUser = {
        id: '123',
        email: 'test@gmail.com',
        password: 'hashed_password', 
        status: 'active'
    };

    const mockRepository = {
      findByEmail: vi.fn().mockResolvedValue(mockUser)
    };

    const authService = new AuthService(mockRepository as any);

    // Act
    const result = await authService.login({
      email: 'test@gmail.com',
      password: 'test21@A'
    });

    // Assert
    expect(result.user.email).toBe('test@gmail.com');
    expect(result).toHaveProperty('token');
  });

});