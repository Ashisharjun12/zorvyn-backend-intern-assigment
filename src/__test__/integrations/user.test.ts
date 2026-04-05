import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { App } from '../../app.js';
import { db, connectDB } from '../../config/database.js';
import { users } from '../../modules/users/user.schema.js';
import { UserRepository } from '../../modules/users/user.repository.js';
import { eq, notInArray } from 'drizzle-orm';

const app = new App().getApp();
const userRepository = new UserRepository();


describe('User Integration Testing', () => {

    
    let adminToken: string;
    let viewerToken: string;
    let viewerId: string;
    let adminId: string;

    beforeAll(async () => {
        // connect to testing DB
        await connectDB();

        // dellet db data 
        await db.delete(users);

        
        // Admin Setup
        const adminData = {
            name: "Test Admin",
            email: "admin@example.com",
            password: "AdminPassword123!"
        };
        await request(app).post('/api/v1/auth/register').send(adminData);
        
        
        const adminInDb = await userRepository.findByEmail(adminData.email);
        if (!adminInDb) throw new Error("Could not create test admin");
        
        adminId = adminInDb.id;
        
        // set to admin 
        await userRepository.update(adminId, { role: 'admin' });

        const adminLogin = await request(app).post('/api/v1/auth/login').send({
            email: adminData.email,
            password: adminData.password
        });
        adminToken = adminLogin.body.data.token;

        //Viewer 
        const viewerData = {
            name: "Test Viewer",
            email: "viewer@example.com",
            password: "ViewerPassword123!"
        };
        await request(app).post('/api/v1/auth/register').send(viewerData);
        
        const viewerLogin = await request(app).post('/api/v1/auth/login').send({
            email: viewerData.email,
            password: viewerData.password
        });
        viewerToken = viewerLogin.body.data.token;
        viewerId = viewerLogin.body.data.user.id;
    });

    beforeEach(async () => {
        // delete all users except admin and viewer
        if (adminId && viewerId) {
            await db.delete(users).where(notInArray(users.id, [adminId, viewerId]));
        }
    });

    // fetch all users
    describe('GET /api/v1/users', () => {
        it('should allow an admin to see all users', async () => {
            // Act
            const response = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${adminToken}`);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2); 
        });

        it('should block a viewer from seeing all users', async () => {
            // Act
            const response = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${viewerToken}`);

            // Assert
            expect(response.status).toBe(403); 
        });
    });

    // fetch profile
    describe('GET /api/v1/users/:id', () => {
        it('should let a user retrieve their own profile', async () => {
            // Act
            const response = await request(app)
                .get(`/api/v1/users/${viewerId}`)
                .set('Authorization', `Bearer ${viewerToken}`);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(viewerId);
        });
    });

    // update profile
    describe('PATCH /api/v1/users/:id', () => {
        it('should let a user update their name', async () => {
            // Act
            const response = await request(app)
                .patch(`/api/v1/users/${viewerId}`)
                .set('Authorization', `Bearer ${viewerToken}`)
                .send({ name: "Updated Name" });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe("Updated Name");
        });
    });

    // delete user
    describe('DELETE /api/v1/users/:id', () => {
        it('should allow an admin to delete a user', async () => {
            // Act
            const response = await request(app)
                .delete(`/api/v1/users/${viewerId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should block a viewer from deleting a user', async () => {
            // Act
            const response = await request(app)
                .delete(`/api/v1/users/${viewerId}`)
                .set('Authorization', `Bearer ${viewerToken}`);

            // Assert
            expect(response.status).toBe(403); 
        });
    });

});
