import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordService } from '../../modules/records/record.service.js';
import { IRecordRepository } from '../../modules/records/record.interface.js';
import { ApiError } from '../../shared/ApiError.js';
import { RecordSelect, CreateRecordDto, UpdateRecordDto } from '../../modules/records/record.schema.js';

describe('RecordService Unit Tests', () => {
  let recordService: RecordService;
  let mockRecordRepo: IRecordRepository;

  // setup mock repository
  beforeEach(() => {
    mockRecordRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    } as any;
    recordService = new RecordService(mockRecordRepo);
  });

  const mockRecord: RecordSelect = {
    id: 'record-123',
    userId: 'user-123',
    amount: 1000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly salary',
    date: new Date('2026-04-01'),
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('createRecord', () => {
    it('should create a record correctly', async () => {
      const dto: CreateRecordDto = {
        amount: 1000,
        type: 'income',
        category: 'Salary',
        description: 'Monthly salary',
        date: '2026-04-01',
      };

      vi.mocked(mockRecordRepo.create).mockResolvedValue(mockRecord);

      // Act
      const result = await recordService.createRecord('user-123', dto);

      // Assert
      expect(mockRecordRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        amount: 1000,
        userId: 'user-123',
      }));
      expect(result).toEqual(mockRecord);
    });
  });

  describe('getRecord', () => {
    it('should return a record if it exists and belongs to the user', async () => {
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(mockRecord);

      // Act
      const result = await recordService.getRecord('record-123', 'user-123');

      // Assert
      expect(mockRecordRepo.findById).toHaveBeenCalledWith('record-123', 'user-123');
      expect(result).toEqual(mockRecord);
    });

    it('should throw ApiError.notFound if record is missing or belongs to another user', async () => {
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(undefined);

      // Act & Assert
      await expect(recordService.getRecord('invalid-id', 'user-123'))
        .rejects.toThrow(ApiError);
      
      try {
        await recordService.getRecord('invalid-id', 'user-123');
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Record not found');
      }
    });
  });

  describe('updateRecord', () => {
    it('should update a record if it exists and belongs to the user', async () => {
      const dto: UpdateRecordDto = { amount: 2000 };
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(mockRecord);
      vi.mocked(mockRecordRepo.update).mockResolvedValue({ ...mockRecord, amount: 2000 });

      // Act
      const result = await recordService.updateRecord('record-123', 'user-123', dto);

      // Assert
      expect(mockRecordRepo.findById).toHaveBeenCalledWith('record-123', 'user-123');
      expect(mockRecordRepo.update).toHaveBeenCalledWith('record-123', 'user-123', expect.objectContaining({
        amount: 2000
      }));
      expect(result.amount).toBe(2000);
    });

    it('should throw ApiError.notFound if record to update is missing or belongs to another user', async () => {
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(undefined);

      // Act & Assert
      await expect(recordService.updateRecord('invalid-id', 'user-123', { amount: 10 }))
        .rejects.toThrow(ApiError);
    });
  });

  describe('softDeleteRecord', () => {
    it('should soft delete a record if it exists and belongs to the user', async () => {
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(mockRecord);
      vi.mocked(mockRecordRepo.softDelete).mockResolvedValue(undefined);

      // Act
      await recordService.softDeleteRecord('record-123', 'user-123');

      // Assert
      expect(mockRecordRepo.findById).toHaveBeenCalledWith('record-123', 'user-123');
      expect(mockRecordRepo.softDelete).toHaveBeenCalledWith('record-123', 'user-123');
    });

    it('should throw ApiError.notFound if record to delete is missing or belongs to another user', async () => {
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(undefined);

      // Act & Assert
      await expect(recordService.softDeleteRecord('invalid-id', 'user-123'))
        .rejects.toThrow(ApiError);
    });
  });
});
