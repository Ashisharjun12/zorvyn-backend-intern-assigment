import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../modules/users/user.service.js';
import { IUserRepository } from '../../modules/users/user.interface.js';

describe('UserService Unit Testing', () => {
    let userService: UserService;
    let mockUserRepo: IUserRepository;

    const mockUser = {
        id: 'user-123',
        name: 'Ashish',
        email: 'ashish@gmail.com',
        password: 'hashed_password',
        role: 'viewer',
        status: 'active'
    };

    // setup mock repository
    beforeEach(() => {
        mockUserRepo = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByEmail: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            softDelete: vi.fn(),
        } as unknown as IUserRepository;
        
        userService = new UserService(mockUserRepo);
    });

    // get all users
    it('should return all users and remove passwords', async () => {
        // Arrange
        vi.mocked(mockUserRepo.findAll).mockResolvedValue([mockUser as any]);

        // Act
        const result = await userService.getAllUsers();

        // Assert
        expect(mockUserRepo.findAll).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
        expect(result[0]).not.toHaveProperty('password'); 
        expect(result[0].name).toBe('Ashish');
    });

    // get user by id
    describe('getUserById', () => {
        it('should get a single user by ID successfully', async () => {
            // Arrange
            vi.mocked(mockUserRepo.findById).mockResolvedValue(mockUser as any);

            // Act
            const result = await userService.getUserById('user-123');

            // Assert
            expect(mockUserRepo.findById).toHaveBeenCalledWith('user-123');
            expect(result.id).toBe('user-123');
            expect(result).not.toHaveProperty('password');
        });

        it('should throw Error 404 if user is not found', async () => {
            // Arrange
            vi.mocked(mockUserRepo.findById).mockResolvedValue(null as any);

            // Act & Assert
            await expect(userService.getUserById('wrong-id')).rejects.toThrow('User not found');
        });
    });

    // update user
    it('should update user info successfully', async () => {
        // Arrange
        const updatedUser = { ...mockUser, name: 'Ashish Updated' };
        vi.mocked(mockUserRepo.findById).mockResolvedValue(mockUser as any);
        vi.mocked(mockUserRepo.update).mockResolvedValue(updatedUser as any);

        // Act
        const result = await userService.updateUser('user-123', { name: 'Ashish Updated' });

        // Assert
        expect(mockUserRepo.findById).toHaveBeenCalledWith('user-123');
        expect(mockUserRepo.update).toHaveBeenCalledWith('user-123', { name: 'Ashish Updated' });
        expect(result.name).toBe('Ashish Updated');
    });

    // soft delete user
    it('should soft delete a user correctly', async () => {
        // Arrange
        vi.mocked(mockUserRepo.findById).mockResolvedValue(mockUser as any);
        vi.mocked(mockUserRepo.softDelete).mockResolvedValue(undefined as any);

        // Act
        await userService.softDeleteUser('user-123');

        // Assert
        expect(mockUserRepo.findById).toHaveBeenCalledWith('user-123');
        expect(mockUserRepo.softDelete).toHaveBeenCalledWith('user-123');
        expect(mockUserRepo.softDelete).toHaveBeenCalledTimes(1);
    });
});
