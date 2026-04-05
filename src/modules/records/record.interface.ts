import { RecordSelect, RecordInsert, CreateRecordDto, UpdateRecordDto, FilterRecordDto } from './record.schema.js';


//repository interface
export interface IRecordRepository {
  findAll(userId: string, query: FilterRecordDto): Promise<{ data: RecordSelect[], total: number }>;
  findById(id: string, userId: string): Promise<RecordSelect | undefined>;
  create(data: RecordInsert): Promise<RecordSelect>;
  update(id: string, userId: string, data: Partial<RecordInsert>): Promise<RecordSelect>;
  softDelete(id: string, userId: string): Promise<void>;
}

//service interface
export interface IRecordService {
  getRecords(userId: string, query: FilterRecordDto): Promise<{ data: RecordSelect[], total: number }>;
  getRecord(id: string, userId: string): Promise<RecordSelect>;
  createRecord(userId: string, dto: CreateRecordDto): Promise<RecordSelect>;
  updateRecord(id: string, userId: string, dto: UpdateRecordDto): Promise<RecordSelect>;
  softDeleteRecord(id: string, userId: string): Promise<void>;
}
