import type { Request, Response } from 'express';
import { BaseController } from '../../shared/BaseController.js';
import { asyncHandler } from '../../middlewares/asyncHandler.middleware.js';
import type { IAuthService } from './auth.interface.js';

export class AuthController extends BaseController {
  constructor(private readonly authService: IAuthService) {
    super();
  }


  //register user
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);
    this.sendCreated(res, result, 'Registration successful');
  });

  //login user
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);
    this.sendSuccess(res, result, 'Login successful');
  });

}
