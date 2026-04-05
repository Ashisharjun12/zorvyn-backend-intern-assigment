import { eq, and, gte, lte, sum, count, desc, sql } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { records } from '../records/record.schema.js';
import {
  IDashboardRepository,
  SummaryStats,
  CategoryTotal,
  MonthlyTrends,
  RecentActivity
} from './dashboard.interface.js';
import { DashboardQueryDto } from './dashboard.schema.js';

export class DashboardRepository implements IDashboardRepository {

  //  get filters
  private getFilters(userId: string, filters: DashboardQueryDto) {
    const conditions = [];
    conditions.push(eq(records.userId, userId));
    conditions.push(eq(records.isDeleted, false));

    if (filters.startDate) {
      conditions.push(gte(records.date, new Date(filters.startDate)));
    }
    if (filters.endDate) {
      conditions.push(lte(records.date, new Date(filters.endDate + " 23:59:59")));
    }

    return and(...conditions);
  }


  // get summary stats
  async getSummaryStats(userId: string, filters: DashboardQueryDto): Promise<SummaryStats> {
    const whereClause = this.getFilters(userId, filters);

    const stats = await db
      .select({
        type: records.type,
        total: sum(records.amount)
      })
      .from(records)
      .where(whereClause)
      .groupBy(records.type);

    let totalIncome = 0;
    let totalExpense = 0;

    stats.forEach(s => {
      if (s.type === 'income') totalIncome = Number(s.total) || 0;
      if (s.type === 'expense') totalExpense = Number(s.total) || 0;
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    };
  }


  // get category totals
  async getCategoryTotals(userId: string, filters: DashboardQueryDto): Promise<CategoryTotal[]> {
    const whereClause = this.getFilters(userId, filters);

    const results = await db
      .select({
        category: records.category,
        total: sum(records.amount),
        count: count()
      })
      .from(records)
      .where(whereClause)
      .groupBy(records.category);

    return results.map(r => ({
      category: r.category,
      total: Number(r.total) || 0,
      count: Number(r.count) || 0
    }));
  }


  // get monthly trends
  async getMonthlyTrends(userId: string, filters: DashboardQueryDto): Promise<MonthlyTrends[]> {

    const whereClause = this.getFilters(userId, filters);
    const monthSql = sql<string>`to_char(${records.date}, 'YYYY-MM')`;

    const results = await db
      .select({
        month: monthSql,
        type: records.type,
        total: sum(records.amount)
      })
      .from(records)
      .where(whereClause)
      .groupBy(monthSql, records.type)
      .orderBy(monthSql);

    // group by month in js
    const trendMap = new Map<string, MonthlyTrends>();

    results.forEach(r => {
      const month = r.month;
      if (!trendMap.has(month)) {
        trendMap.set(month, { month, income: 0, expense: 0 });
      }
      // get trend
      const trend = trendMap.get(month)!;
      if (r.type === 'income') trend.income = Number(r.total) || 0;
      if (r.type === 'expense') trend.expense = Number(r.total) || 0;
    });

    return Array.from(trendMap.values());
  }


  // get  recent activity
  async getRecentActivity(userId: string, limit: number = 5): Promise<RecentActivity[]> {
    const results = await db
      .select()
      .from(records)
      .where(and(eq(records.userId, userId), eq(records.isDeleted, false)))
      .orderBy(desc(records.date))
      .limit(limit);

    return results.map(r => ({
      id: r.id,
      amount: r.amount,
      type: r.type,
      category: r.category,
      description: r.description,
      date: r.date
    }));
  }
}
