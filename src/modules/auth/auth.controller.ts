import type { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.middleware.js';
import type { IAuthService } from './auth.interface.js';


export class AuthController {
  constructor(private readonly authService: IAuthService) {}


  //register user
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Registration successful'
    });
  });

  //login user
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  });
}
