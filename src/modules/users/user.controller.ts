import type { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.middleware.js';
import type { IUserService } from './user.interface.js';

export class UserController {
  constructor(private readonly userService: IUserService) {}

  // Get all users
  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
      message: 'Users fetched successfully'
    });
  });

  // Get user by id
  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.userService.getUserById(id);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User fetched successfully'
    });
  });

  // Update user
  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.userService.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  });

  // Update role
  updateRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.userService.updateRole(id, req.body);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User role updated successfully'
    });
  });

  // Update status
  updateStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user = await this.userService.updateStatus(id, req.body);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User status updated successfully'
    });
  });

  // Soft Delete user
  softDeleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await this.userService.softDeleteUser(id);
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  });
}
