import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardService } from '../../modules/dashboard/dashboard.service.js';
import { IDashboardRepository } from '../../modules/dashboard/dashboard.interface.js';
import { DashboardQueryDto } from '../../modules/dashboard/dashboard.schema.js';

describe('DashboardService Unit Tests', () => {
    let dashboardService: DashboardService;
    let mockDashboardRepo: IDashboardRepository;

    beforeEach(() => {
        mockDashboardRepo = {
            getSummaryStats: vi.fn(),
            getCategoryTotals: vi.fn(),
            getMonthlyTrends: vi.fn(),
            getRecentActivity: vi.fn(),
        };
        dashboardService = new DashboardService(mockDashboardRepo);
    });

    const userId = 'user-123';
    const filters: DashboardQueryDto = {
        startDate: '2026-01-01',
        endDate: '2026-01-31'
    };

    it('should return combined dashboard data from all repository methods', async () => {
        // Arrange
        const mockSummary = { totalIncome: 1000, totalExpense: 500, netBalance: 500 };
        const mockCategories = [{ category: 'Food', total: 200, count: 5 }];
        const mockTrends = [{ month: '2026-01', income: 1000, expense: 500 }];
        const mockActivity = [
            { id: '1', amount: 100, type: 'expense' as const, description: 'Food', category: 'Food', date: new Date() }
        ];

        vi.mocked(mockDashboardRepo.getSummaryStats).mockResolvedValue(mockSummary);
        vi.mocked(mockDashboardRepo.getCategoryTotals).mockResolvedValue(mockCategories);
        vi.mocked(mockDashboardRepo.getMonthlyTrends).mockResolvedValue(mockTrends);
        vi.mocked(mockDashboardRepo.getRecentActivity).mockResolvedValue(mockActivity);

        // Act
        const result = await dashboardService.getDashboardData(userId, filters);

        // Assert
        expect(mockDashboardRepo.getSummaryStats).toHaveBeenCalledWith(userId, filters);
        expect(mockDashboardRepo.getCategoryTotals).toHaveBeenCalledWith(userId, filters);
        expect(mockDashboardRepo.getMonthlyTrends).toHaveBeenCalledWith(userId, filters);
        expect(mockDashboardRepo.getRecentActivity).toHaveBeenCalledWith(userId, 5);

        expect(result).toEqual({
            summary: mockSummary,
            categoryTotals: mockCategories,
            monthlyTrends: mockTrends,
            recentActivity: mockActivity
        });
    });

    it('should pass default limit to getRecentActivity if not specified', async () => {
        // Act
        await dashboardService.getDashboardData(userId, {});

        // Assert
        expect(mockDashboardRepo.getRecentActivity).toHaveBeenCalledWith(userId, 5);
    });
});
