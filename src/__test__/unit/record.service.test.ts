import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordService } from '../../modules/records/record.service.js';
import { IRecordRepository } from '../../modules/records/record.interface.js';
import { ApiError } from '../../shared/ApiError.js';
import { RecordSelect } from '../../modules/records/record.schema.js';

describe('RecordService Unit Testing', () => {
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
    };
    recordService = new RecordService(mockRecordRepo);
  });

  const mockRecord: RecordSelect = {
    id: 'record-123',
    userId: 'user-123',
    amount: 1000, 
    type: 'expense',
    category: 'Food',
    description: 'Lunch',
    date: new Date('2026-04-05'),
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // get records
  describe('getRecords', () => {
    it('should return a list of records and total count', async () => {
      // Arrange
      const userId = 'user-123';
      const query = { page: 1, limit: 10 };
      const mockResult = { data: [mockRecord], total: 1 };
      vi.mocked(mockRecordRepo.findAll).mockResolvedValue(mockResult);

      // Act
      const result = await recordService.getRecords(userId, query);

      // Assert
      expect(mockRecordRepo.findAll).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(mockResult);
    });
  });

  // get record by id
  describe('getRecord', () => {
    it('should return a record when it exists', async () => {
      // Arrange
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(mockRecord);

      // Act
      const result = await recordService.getRecord('record-123');

      // Assert
      expect(mockRecordRepo.findById).toHaveBeenCalledWith('record-123');
      expect(result).toEqual(mockRecord);
    });

    it('should throw ApiError.notFound when record is missing', async () => {
      // Arrange
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(undefined);

      // Act & Assert
      await expect(recordService.getRecord('invalid-id'))
        .rejects.toThrow(ApiError);
      
      try {
        await recordService.getRecord('invalid-id');
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Record not found');
      }
    });
  });

  // create record
  describe('createRecord', () => {
    it('should format date and return the new record', async () => {
      // Arrange
      const userId = 'user-123';
      const dto = {
        amount: 50,
        type: 'income' as const,
        category: 'Salary',
        description: 'Bonus',
        date: '2024-02-01',
      };
      vi.mocked(mockRecordRepo.create).mockResolvedValue(mockRecord);

      // Act
      const result = await recordService.createRecord(userId, dto);

      // Assert
      expect(mockRecordRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        ...dto,
        userId,
        date: expect.any(Date),
      }));
      expect(result).toEqual(mockRecord);
    });
  });

  // update record
  describe('updateRecord', () => {
    it('should update and return the record if it exists', async () => {
      // Arrange
      const dto = { amount: 200 };
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(mockRecord);
      vi.mocked(mockRecordRepo.update).mockResolvedValue({ ...mockRecord, amount: 200 });

      // Act
      const result = await recordService.updateRecord('record-123', dto);

      // Assert
      expect(mockRecordRepo.findById).toHaveBeenCalledWith('record-123');
      expect(mockRecordRepo.update).toHaveBeenCalledWith('record-123', expect.objectContaining({
        amount: 200
      }));
      expect(result.amount).toBe(200);
    });

    it('should throw ApiError.notFound if record to update is missing', async () => {
      // Arrange
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(undefined);

      // Act & Assert
      await expect(recordService.updateRecord('invalid-id', { amount: 10 }))
        .rejects.toThrow(ApiError);
    });
  });

  // soft delete record
  describe('softDeleteRecord', () => {
    it('should call softDelete if record exists', async () => {
      // Arrange
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(mockRecord);
      vi.mocked(mockRecordRepo.softDelete).mockResolvedValue(undefined);

      // Act
      await recordService.softDeleteRecord('record-123');

      // Assert
      expect(mockRecordRepo.findById).toHaveBeenCalledWith('record-123');
      expect(mockRecordRepo.softDelete).toHaveBeenCalledWith('record-123');
    });

    it('should throw ApiError.notFound if record to delete is missing', async () => {
      // Arrange
      vi.mocked(mockRecordRepo.findById).mockResolvedValue(undefined);

      // Act & Assert
      await expect(recordService.softDeleteRecord('invalid-id'))
        .rejects.toThrow(ApiError);
    });
  });
});
