import { IDashboardRepository, IDashboardService, DashboardData } from './dashboard.interface.js';
import { DashboardQueryDto } from './dashboard.schema.js';

export class DashboardService implements IDashboardService {
  constructor(private readonly dashboardRepo: IDashboardRepository) {}

  async getDashboardData(userId: string, filters: DashboardQueryDto): Promise<DashboardData> {
    //  fetch all in parallel
    const [summary, categoryTotals, monthlyTrends, recentActivity] = await Promise.all([
      // summary stats
      this.dashboardRepo.getSummaryStats(userId, filters),
      // category totals
      this.dashboardRepo.getCategoryTotals(userId, filters),
      // monthly trends
      this.dashboardRepo.getMonthlyTrends(userId, filters),
      // recent activity
      this.dashboardRepo.getRecentActivity(userId, 5) // defalt 5 recent activity
    ]);

    return {
      summary,
      categoryTotals,
      monthlyTrends,
      recentActivity
    };
  }
}
