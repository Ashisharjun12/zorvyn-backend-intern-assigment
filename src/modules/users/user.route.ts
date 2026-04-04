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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         name: { type: string }
 *         email: { type: string, format: email }
 *         role: { type: string, enum: [viewer, analyst, admin] }
 *         status: { type: string, enum: [active, inactive] }
 *         createdAt: { type: string, format: date-time }
 */

//authiencation middleware
router.use(authenticate);


// get all users
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin/Analyst only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
    '/',
    customRole('admin', 'analyst'),
    userController.getAllUsers
);

// get user by id

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User details
 */
router.get(
    '/:id',
    userController.getUserById
);


// update user
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch(
    '/:id',
    validate(UpdateUserSchema),
    userController.updateUser
);

// update user role
/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Update user role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [viewer, analyst, admin] }
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.patch(
    '/:id/role',
    customRole('admin'),
    validate(UpdateRoleSchema),
    userController.updateRole
);


// update user status
/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     summary: Update user status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [active, inactive] }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch(
    '/:id/status',
    customRole('admin'),
    validate(UpdateStatusSchema),
    userController.updateStatus
);


// soft delete user
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Soft delete a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
    '/:id',
    customRole('admin'),
    userController.softDeleteUser
);

export default router;