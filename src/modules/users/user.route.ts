import { Router } from 'express';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { customRole } from '../../middlewares/rabc.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { UpdateUserSchema, UpdateRoleSchema, UpdateStatusSchema } from './user.schema.js';

const router = Router();


const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

//authiencation middleware
router.use(authenticate);


//get all users
router.get(
  '/',
  customRole('admin', 'analyst'),
  userController.getAllUsers
);

//get user by id
router.get(
  '/:id',
  userController.getUserById
);

//update user
router.patch(
  '/:id',
  validate(UpdateUserSchema),
  userController.updateUser
);

//update user role
router.patch(
  '/:id/role',
  customRole('admin'),
  validate(UpdateRoleSchema),
  userController.updateRole
);

//update user status
router.patch(
  '/:id/status',
  customRole('admin'),
  validate(UpdateStatusSchema),
  userController.updateStatus
);

//Soft delete user
router.delete(
  '/:id',
  customRole('admin'),
  userController.softDeleteUser
);

export default router;