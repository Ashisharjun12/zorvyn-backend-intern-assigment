import { eq, and, desc, gte, lte, count, ilike } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { records } from './record.schema.js';
import { ApiError } from '../../shared/ApiError.js';
import type { RecordSelect, RecordInsert, FilterRecordDto } from './record.schema.js';
import type { IRecordRepository } from './record.interface.js';

export class RecordRepository implements IRecordRepository {

  // find all with filters and pagination
  async findAll(userId: string, query: FilterRecordDto): Promise<{ data: RecordSelect[], total: number }> {
    const { limit, page, type, category, startDate, endDate ,search } = query;
    const offset = (page - 1) * limit;

    // conditions 

    const conditions = [];
    conditions.push(
      eq(records.userId, userId),
      eq(records.isDeleted, false)
    );

    // Add filters
    if (type) {
      conditions.push(eq(records.type, type));
    }

    if (category) {
      conditions.push(ilike(records.category, `%${category}%`));
    }

    if (startDate) {
      conditions.push(gte(records.date, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(records.date, new Date(endDate + " 23:59:59")));
    }

    //search 
    if(search){
      conditions.push(
        ilike(records.description,`%${search}%`),
        ilike(records.category,`%${search}%`)
    )
    }

    //  total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(records)
      .where(and(...conditions));

    const total = Number(totalResult[0]?.count);

    // Getting data
    const data = await db
      .select()
      .from(records)
      .where(and(...conditions))
      .orderBy(desc(records.date))
      .limit(limit)
      .offset(offset);

    return {
      data: data,
      total:total
    };
  }


  // find by id
  async findById(id: string): Promise<RecordSelect | undefined> {
    const [record] = await db
      .select()
      .from(records)
      .where(and(eq(records.id, id), eq(records.isDeleted, false))).limit(1);
    return record;
  }

  // create
  async create(data: RecordInsert): Promise<RecordSelect> {
    const [newRecord] = await db
      .insert(records)
      .values(data)
      .returning();
    return newRecord;
  }

  // update
  async update(id: string, data: Partial<RecordInsert>): Promise<RecordSelect> {
    const [updated] = await db
      .update(records)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(records.id, id), eq(records.isDeleted, false)))
      .returning();

    if (!updated) throw ApiError.notFound('Record not found or already deleted');
    return updated;
  }

  // soft delete
  async softDelete(id: string): Promise<void> {
    const [deleted] = await db
      .update(records)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(records.id, id), eq(records.isDeleted, false)))
      .returning();

    if (!deleted) throw ApiError.notFound('Record not found');
  }
}
