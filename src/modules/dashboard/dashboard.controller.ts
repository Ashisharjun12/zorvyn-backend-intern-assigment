import { Request, Response } from 'express';
import { IDashboardService } from './dashboard.interface.js';
import { asyncHandler } from '../../middlewares/asyncHandler.middleware.js';

export class DashboardController {
  constructor(private readonly dashboardService: IDashboardService) {}

  getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const filters = req.query as any;

    const data = await this.dashboardService.getDashboardData(userId, filters);

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data
    });
  });
}
