import { describe, it, expect, vi } from 'vitest';
import { UserService } from '../../modules/users/user.service.js';


describe('UserService Unit Testing', () => {

    const mockUser = {
        id: 'user-123',
        name: 'Ashish',
        email: 'ashish@gmail.com',
        password: 'hashed_password',
        role: 'viewer',
        status: 'active'
    };

// get all users test
    it('should return all users and remove passwords ', async () => {
        // Arrange
        const mockRepository = {
            findAll: vi.fn().mockResolvedValue([mockUser])
        };
        const userService = new UserService(mockRepository as any);

        // Act
        const result = await userService.getAllUsers();

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0]).not.toHaveProperty('password'); 
        expect(result[0].name).toBe('Ashish');
    });


    // get single user test
    it('should get a single user by ID successfully', async () => {
        // Arrange
        const mockRepository = {
            findById: vi.fn().mockResolvedValue(mockUser)
        };
        const userService = new UserService(mockRepository as any);

        // Act
        const result = await userService.getUserById('user-123');

        // Assert
        expect(result.id).toBe('user-123');
        expect(result).not.toHaveProperty('password');
    });


    // get single user test
    it('should throw Error 404 if user is not found', async () => {
        // Arrange
        const mockRepository = {
            findById: vi.fn().mockResolvedValue(null) // Not found
        };
        const userService = new UserService(mockRepository as any);

        // Act & Assert
        // We expect an error here
        await expect(userService.getUserById('wrong-id')).rejects.toThrow('User not found');
    });


    // update user test
    it('should update user info successfully', async () => {
        // Arrange
        const updatedUser = { ...mockUser, name: 'Ashish Updated' };
        const mockRepository = {
            findById: vi.fn().mockResolvedValue(mockUser),
            update: vi.fn().mockResolvedValue(updatedUser)
        };
        const userService = new UserService(mockRepository as any);

        // Act
        const result = await userService.updateUser('user-123', { name: 'Ashish Updated' });

        //  Assert
        expect(result.name).toBe('Ashish Updated');
        expect(mockRepository.update).toHaveBeenCalledWith('user-123', { name: 'Ashish Updated' });
    });

    // soft delete user test
    it('should soft delete a user correctly', async () => {
        // Arrange
        const mockRepository = {
            findById: vi.fn().mockResolvedValue(mockUser),
            softDelete: vi.fn().mockResolvedValue(undefined)
        };
        const userService = new UserService(mockRepository as any);

        //  Act
        await userService.softDeleteUser('user-123');

        // Assert
        expect(mockRepository.softDelete).toHaveBeenCalledTimes(1);
        expect(mockRepository.softDelete).toHaveBeenCalledWith('user-123');
    });

});
