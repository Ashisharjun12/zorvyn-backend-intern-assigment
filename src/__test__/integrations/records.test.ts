import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { App } from '../../app.js';
import { db, connectDB } from '../../config/database.js';
import { users } from '../../modules/users/user.schema.js';
import { records } from '../../modules/records/record.schema.js';
import { UserRepository } from '../../modules/users/user.repository.js';
import { eq, notInArray } from 'drizzle-orm';

const app = new App().getApp();
const userRepository = new UserRepository();

describe('Records Integration Testing', () => {

    // tokens and ids for different roles
    let adminToken: string;
    let analystToken: string;
    let viewerToken: string;
    
    let adminId: string;
    let analystId: string;
    let viewerId: string;

    beforeAll(async () => {
        // connect to the testing db
        await connectDB();

        // clear users to start fresh
        await db.delete(users);

        // setup admin, analyst, viewer
        
        // setup admin
        const adminData = { name: "Record Admin", email: "record_admin@example.com", password: "AdminPassword123!" };
        await request(app).post('/api/v1/auth/register').send(adminData);
        const adminInDb = await userRepository.findByEmail(adminData.email);
        adminId = adminInDb!.id;
        await userRepository.update(adminId, { role: 'admin' });

        const adminLogin = await request(app).post('/api/v1/auth/login').send({
            email: adminData.email,
            password: adminData.password
        });
        adminToken = adminLogin.body.data.token;

        // setup analyst
        const analystData = { name: "Record Analyst", email: "analyst@example.com", password: "AnalystPassword123!" };
        await request(app).post('/api/v1/auth/register').send(analystData);
        const analystInDb = await userRepository.findByEmail(analystData.email);
        analystId = analystInDb!.id;
        await userRepository.update(analystId, { role: 'analyst' });

        const analystLogin = await request(app).post('/api/v1/auth/login').send({
            email: analystData.email,
            password: analystData.password
        });
        analystToken = analystLogin.body.data.token;

        // Setup Viewer
        const viewerData = { name: "Record Viewer", email: "viewer@example.com", password: "ViewerPassword123!" };
        await request(app).post('/api/v1/auth/register').send(viewerData);
        
        const viewerLogin = await request(app).post('/api/v1/auth/login').send({
            email: viewerData.email,
            password: viewerData.password
        });
        viewerToken = viewerLogin.body.data.token;
        viewerId = viewerLogin.body.data.user.id;
    });

    beforeEach(async () => {
        // delete all records
        await db.delete(records);

        // delete extra users but keep 3 test users
        await db.delete(users).where(
            notInArray(users.id, [adminId, analystId, viewerId])
        );
    });

    // create records
    describe('POST /api/v1/records', () => {
        const validRecord = {
            amount: 5000, 
            type: 'income',
            category: 'Freelance',
            description: 'Web development project',
            date: '2026-04-10'
        };

        // admin can create record
        it('should allow an admin to create a new record', async () => {
            const response = await request(app)
                .post('/api/v1/records')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validRecord);

            expect(response.status).toBe(201);
            expect(response.body.data.amount).toBe(5000);
            expect(response.body.data.userId).toBe(adminId);
        });

        // analyst cannot create record
        it('should block an analyst from creating a record', async () => {
            const response = await request(app)
                .post('/api/v1/records')
                .set('Authorization', `Bearer ${analystToken}`)
                .send(validRecord);

            expect(response.status).toBe(403); // Forbidden
        });

        // invalid data
        it('should fail creation with invalid data', async () => {
            const response = await request(app)
                .post('/api/v1/records')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ ...validRecord, amount: -100 });

            expect(response.status).toBe(400); 
        });
    });

    // list records
    describe('GET /api/v1/records', () => {
        it('should allow an analyst to see the records list', async () => {
            // analyst can see records
            const response = await request(app)
                .get('/api/v1/records')
                .set('Authorization', `Bearer ${analystToken}`);

            expect(response.status).toBe(200);
        });

        it('should not allow an analyst to see an admins record', async () => {
             // admin create record
            const res = await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 1000, type: 'income', category: 'Gift', date: '2026-04-05'
            });
            const recordId = res.body.data.id;

        // analyst cannot see admin's record
            const listRes = await request(app)
                .get('/api/v1/records')
                .set('Authorization', `Bearer ${analystToken}`);
            
            expect(listRes.body.data).toHaveLength(0);

            // analyst should NOT be able to get it by ID
            const getRes = await request(app)
                .get(`/api/v1/records/${recordId}`)
                .set('Authorization', `Bearer ${analystToken}`);

            expect(getRes.status).toBe(404);
        });

        // viewer cannot see records
        it('should block a viewer from seeing the records list', async () => {
            const response = await request(app)
                .get('/api/v1/records')
                .set('Authorization', `Bearer ${viewerToken}`);

            expect(response.status).toBe(403);
        });
    });

    // update records by id -admin
    describe('PATCH /api/v1/records/:id', () => {
        let recordId: string;

        beforeEach(async () => {
            // create a record to update 
            const res = await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 1000, type: 'income', category: 'Gift', date: '2026-04-05'
            });
            recordId = res.body.data.id;
        });

        // admin can update record
        it('should allow an admin to update their own record', async () => {
            const response = await request(app)
                .patch(`/api/v1/records/${recordId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ amount: 2000 });

            expect(response.status).toBe(200);
            expect(response.body.data.amount).toBe(2000);
        });

        // analyst cannot update record 
        it('should block an analyst from updating any record', async () => {
            const response = await request(app)
                .patch(`/api/v1/records/${recordId}`)
                .set('Authorization', `Bearer ${analystToken}`)
                .send({ amount: 2000 });

            expect(response.status).toBe(403);
        });
    });

    // delete records
    describe('DELETE /api/v1/records/:id', () => {
        it('should allow an admin to soft-delete their own record', async () => {
            // create a record
            const res = await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 500, type: 'expense', category: 'Misc', date: '2026-04-01'
            });
            const recordId = res.body.data.id;

            // delete record
            const response = await request(app)
                .delete(`/api/v1/records/${recordId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

         it('should return 404/Forbidden if deleting another users record', async () => {
           // analyst cannot delete record
            const response = await request(app)
                .delete(`/api/v1/records/any-id`)
                .set('Authorization', `Bearer ${analystToken}`);

            expect(response.status).toBe(403);
        });
    });

});
