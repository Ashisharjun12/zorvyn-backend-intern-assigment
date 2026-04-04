import { Router } from "express";
import { DashboardRepository } from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";
import { DashboardController } from "./dashboard.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { customRole } from "../../middlewares/rabc.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { dashboardQuerySchema } from "./dashboard.schema.js";

const router = Router();


const dashboardRepo = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepo);
const dashboardController = new DashboardController(dashboardService);

// authentication middleware
router.use(authenticate);


// get dashboard summary
/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardData:
 *       type: object
 *       properties:
 *         summary:
 *           type: object
 *           properties:
 *             totalIncome: { type: number }
 *             totalExpense: { type: number }
 *             netBalance: { type: number }
 *         categoryTotals:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category: { type: string }
 *               total: { type: number }
 *               count: { type: integer }
 *         monthlyTrends:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               month: { type: string }
 *               income: { type: number }
 *               expense: { type: number }
 *         recentActivity:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Record'
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard analytical summary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema: { type: string, format: date }
 *       - name: endDate
 *         in: query
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardData'
 */
router.get(
  "/",
  customRole("admin", "analyst", "viewer"),
  validate(dashboardQuerySchema, "query"),
  dashboardController.getDashboardData
);

export default router;