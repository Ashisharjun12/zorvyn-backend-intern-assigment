import { ApiError } from '../../shared/ApiError.js';
import { IRecordRepository, IRecordService } from "./record.interface.js";
import { RecordSelect, CreateRecordDto, UpdateRecordDto, FilterRecordDto } from './record.schema.js';

export class RecordService implements IRecordService {
  constructor(private readonly recordRepo: IRecordRepository) { }

  // get all records with filters and pagination
  async getRecords(userId: string, query: FilterRecordDto): Promise<{ data: RecordSelect[], total: number }> {
    return await this.recordRepo.findAll(userId, query);
  }

  // get record by its id
  async getRecord(id: string, userId: string): Promise<RecordSelect> {
    const record = await this.recordRepo.findById(id, userId);

    if (!record) {
      throw ApiError.notFound('Record not found');
    }

    return record;
  }

  // create  new  record
  async createRecord(userId: string, dto: CreateRecordDto): Promise<RecordSelect> {
    const record = await this.recordRepo.create({
      ...dto,
      userId,
      date: new Date(dto.date),
    });

    return record;
  }


  // update  record
  async updateRecord(id: string, userId: string, dto: UpdateRecordDto): Promise<RecordSelect> {
    // check record if exist
    const existing = await this.recordRepo.findById(id, userId);

    if (!existing) {
      throw ApiError.notFound('Record not found');
    }

    return this.recordRepo.update(id, userId, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }


  // soft delete record
  async softDeleteRecord(id: string, userId: string): Promise<void> {
    const record = await this.recordRepo.findById(id, userId);

    if (!record) {
      throw ApiError.notFound('Record not found');
    }

    await this.recordRepo.softDelete(id, userId);
  }
}
