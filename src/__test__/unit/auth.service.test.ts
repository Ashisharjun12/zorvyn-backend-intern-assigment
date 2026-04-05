import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../modules/auth/auth.service.js';
import { IUserRepository } from '../../modules/users/user.interface.js';

// mock password utility
vi.mock('../../utils/hash.js', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
  comparePassword: vi.fn().mockResolvedValue(true) 
}));

describe('AuthService Unit Testing', () => {
    let authService: AuthService;
    let mockUserRepo: IUserRepository;

    const mockUser = {
        id: 'user-123',
        name: 'Ashish',
        email: 'test@gmail.com',
        password: 'hashed_password',
        status: 'active'
    };

    // setup mock repository
    beforeEach(() => {
        mockUserRepo = {
            findByEmail: vi.fn(),
            create: vi.fn(),
        } as unknown as IUserRepository;

        authService = new AuthService(mockUserRepo);
    });

    // register user
    it('should register a new user successfully', async () => {
        // Arrange
        vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null as any);
        vi.mocked(mockUserRepo.create).mockResolvedValue(mockUser as any);

        const userData = {
            name: 'Ashish',
            email: 'test@gmail.com',
            password: 'test21@A'
        };

        // Act 
        const result = await authService.register(userData);

        // Assert
        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(mockUserRepo.create).toHaveBeenCalled();
        expect(result.user.name).toBe('Ashish');
        expect(result.user.email).toBe('test@gmail.com');
        expect(result).toHaveProperty('token'); 
    });

    // login user
    it('should login a user successfully', async () => {
        // Arrange
        vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(mockUser as any);

        const loginData = {
            email: 'test@gmail.com',
            password: 'test21@A'
        };

        // Act
        const result = await authService.login(loginData);

        // Assert
        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(loginData.email);
        expect(result.user.email).toBe('test@gmail.com');
        expect(result).toHaveProperty('token');
    });

});