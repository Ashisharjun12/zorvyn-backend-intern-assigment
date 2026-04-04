import { DashboardQueryDto } from './dashboard.schema.js';

// summary stats
export interface SummaryStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

// category total
export interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

// Monthly Trends
export interface MonthlyTrends {
  month: string;
  income: number;
  expense: number;
}

// RecentActivity
export interface RecentActivity {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string | null;
  date: Date;
}

// Dashboard Data
export interface DashboardData {
  summary: SummaryStats;
  categoryTotals: CategoryTotal[];
  monthlyTrends: MonthlyTrends[];
  recentActivity: RecentActivity[];
}

// Repository Interface
export interface IDashboardRepository {
  getSummaryStats(userId: string, filters: DashboardQueryDto): Promise<SummaryStats>;
  getCategoryTotals(userId: string, filters: DashboardQueryDto): Promise<CategoryTotal[]>;
  getMonthlyTrends(userId: string, filters: DashboardQueryDto): Promise<MonthlyTrends[]>;
  getRecentActivity(userId: string, limit?: number): Promise<RecentActivity[]>;
}

// Service Interface
export interface IDashboardService {
  getDashboardData(userId: string, filters: DashboardQueryDto): Promise<DashboardData>;
}
