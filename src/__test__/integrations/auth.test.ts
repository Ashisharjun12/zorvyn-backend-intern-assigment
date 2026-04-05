import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { App } from '../../app.js';
import { db, connectDB } from '../../config/database.js';
import { users } from '../../modules/users/user.schema.js';

const app = new App().getApp();

describe('Auth Integration Testing', () => {

    beforeAll(async () => {
        await connectDB();
    });
 
    beforeEach(async () => {
        await db.delete(users);
    });

    // register test
    describe('POST /api/v1/auth/register', () => {
        const newUser = {
            name: "John Doe",
            email: "john@gmail.com",
            password: "Pasword123!"
        };

        it('should successfully create a new user and return a token', async () => {
            // Act
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(newUser);

            // Assert
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe(newUser.email);
        });

        it('should fail if the email is already registered', async () => {
            // 1. Arrange - register the user the first time
            await request(app).post('/api/v1/auth/register').send(newUser);

            // 2. Act - try to register same user again
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(newUser);

            // 3. Assert 
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });
    });

    // login test
    describe('POST /api/v1/auth/login', () => {
        const credentials = {
            email: "login_test@example.com",
            password: "Password123!"
        };

        // we prepare a user in the DB strictly for login tests
        beforeEach(async () => {
            await request(app).post('/api/v1/auth/register').send({
                name: "Login User",
                ...credentials
            });
        });

        it('should login successfully with correct credentials', async () => {
            // Act
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(credentials);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            // Act
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: credentials.email,
                    password: "WrongPassword!"
                });

            // Assert
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });
    });

});
