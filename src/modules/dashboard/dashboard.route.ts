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

// get dashboard summary - (admin, analyst, viewer)
router.get(
  "/",
  customRole("admin", "analyst", "viewer"),
  validate(dashboardQuerySchema, "query"),
  dashboardController.getDashboardData
);

export default router;