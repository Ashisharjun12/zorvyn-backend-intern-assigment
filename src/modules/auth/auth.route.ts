import { Router } from 'express';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authLimiter } from '../../middlewares/ratelimit.middleware.js';
import { RegisterSchema, LoginSchema } from './auth.schema.js';

const router = Router();


const authRepository = new AuthRepository();
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)


// register route
router.post(
  '/register',
  authLimiter,
  validate(RegisterSchema),
  authController.register
);

//login route
router.post(
  '/login',
  authLimiter,
  validate(LoginSchema),
  authController.login
);

export default router;