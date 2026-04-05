import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { App } from '../../app.js';
import { db, connectDB } from '../../config/database.js';
import { users } from '../../modules/users/user.schema.js';
import { records } from '../../modules/records/record.schema.js';
import { UserRepository } from '../../modules/users/user.repository.js';

const app = new App().getApp();
const userRepository = new UserRepository();

describe('Dashboard Integration Testing', () => {

    let adminToken: string;
    let analystToken: string;
    let viewerToken: string;
    let otherUserToken: string;

    beforeAll(async () => {
        await connectDB();
        await db.delete(users);

        //Setup Admin
        const adminData = { name: "Dash Admin", email: "dash_admin@example.com", password: "AdminPassword123!" };
        await request(app).post('/api/v1/auth/register').send(adminData);
        const adminInDb = await userRepository.findByEmail(adminData.email);
        await userRepository.update(adminInDb!.id, { role: 'admin' });
        const adminLogin = await request(app).post('/api/v1/auth/login').send({ email: adminData.email, password: adminData.password });
        adminToken = adminLogin.body.data.token;

        //Setup Analyst
        const analystData = { name: "Dash Analyst", email: "dash_analyst@example.com", password: "AnalystPassword123!" };
        await request(app).post('/api/v1/auth/register').send(analystData);
        const analystInDb = await userRepository.findByEmail(analystData.email);
        await userRepository.update(analystInDb!.id, { role: 'analyst' });
        const analystLogin = await request(app).post('/api/v1/auth/login').send({ email: analystData.email, password: analystData.password });
        analystToken = analystLogin.body.data.token;

        //Setup Viewer
        const viewerData = { name: "Dash Viewer", email: "dash_viewer@example.com", password: "ViewerPassword123!" };
        await request(app).post('/api/v1/auth/register').send(viewerData);
        const viewerLogin = await request(app).post('/api/v1/auth/login').send({ email: viewerData.email, password: viewerData.password });
        viewerToken = viewerLogin.body.data.token;

        //Setup Other User
        const otherData = { name: "Other User", email: "other@example.com", password: "OtherPassword123!" };
        await request(app).post('/api/v1/auth/register').send(otherData);
        const otherLogin = await request(app).post('/api/v1/auth/login').send({ email: otherData.email, password: otherData.password });
        otherUserToken = otherLogin.body.data.token;
    });

    beforeEach(async () => {
        await db.delete(records);
    });


    // get dashboard data
    describe('GET /api/v1/dashboard', () => {

        it('should return correct summary stats and activities for the current user', async () => {
            // Arrange
            await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 3000, type: 'income', category: 'Salary', date: '2026-04-01'
            });
            await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 1000, type: 'expense', category: 'Rent', date: '2026-04-02'
            });

            // Act
            const response = await request(app)
                .get('/api/v1/dashboard')
                .set('Authorization', `Bearer ${adminToken}`);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.data.summary.totalIncome).toBe(3000);
            expect(response.body.data.summary.totalExpense).toBe(1000);
            expect(response.body.data.summary.netBalance).toBe(2000);
            expect(response.body.data.recentActivity).toHaveLength(2);
        });

        it('should maintain strict multi-tenancy (user sees only their data)', async () => {
             // Admin adds records
             await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 500, type: 'income', category: 'Misc', date: '2026-04-01'
            });

            // Other User checks their dashboard
            const response = await request(app)
                .get('/api/v1/dashboard')
                .set('Authorization', `Bearer ${otherUserToken}`);

            expect(response.body.data.summary.totalIncome).toBe(0);
            expect(response.body.data.recentActivity).toHaveLength(0);
        });

        // role based access
        it('should allow analyst and viewer roles to access dashboard data', async () => {
            const roles = [analystToken, viewerToken];
            
            for (const token of roles) {
                const response = await request(app)
                    .get('/api/v1/dashboard')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            }
        });

        // category totals
        it('should calculate category totals correctly', async () => {
            await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 100, type: 'expense', category: 'Food', date: '2026-04-01'
            });
            await request(app).post('/api/v1/records').set('Authorization', `Bearer ${adminToken}`).send({
                amount: 200, type: 'expense', category: 'Food', date: '2026-04-02'
            });

            const response = await request(app)
                .get('/api/v1/dashboard')
                .set('Authorization', `Bearer ${adminToken}`);

            const food = response.body.data.categoryTotals.find((c: any) => c.category === 'Food');
            expect(food.total).toBe(300);
            expect(food.count).toBe(2);
        });
    });

});
