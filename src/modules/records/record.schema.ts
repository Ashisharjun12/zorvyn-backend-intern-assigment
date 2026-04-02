import { pgTable, pgEnum, uuid, varchar, timestamp, numeric, boolean, text, index } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { users } from '../users/user.schema.js';

export const recordTypeEnum = pgEnum('record_type', ['income', 'expense']);

export const records = pgTable(
    'records',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
        amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
        type: recordTypeEnum('type').notNull(),
        category: varchar('category', { length: 100 }).notNull(),
        description: text('description'),
        date: timestamp('date').defaultNow().notNull(),
        isDeleted: boolean('is_deleted').default(false).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (t) => [
        index('records_user_id_idx').on(t.userId),
        index('records_type_idx').on(t.type),
        index('records_category_idx').on(t.category),
        index('records_date_idx').on(t.date),
    ]
);

export type RecordSelect = typeof records.$inferSelect;
export type RecordInsert = typeof records.$inferInsert;

// Zod Validation 
export const CreateRecordSchema = z.object({
    amount: z.number("amount must be number").int("amount must be integer").positive("amount must be positive"),
    type: z.enum(recordTypeEnum.enumValues),
    category: z.string("category must be string").min(1, "category must be at least 1 character").max(100, "category must be at most 100 characters"),
    description: z.string("description must be string").max(500, "description must be at most 500 characters").optional(),
    date: z.string("date must be string").regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

});

// update record schema
export const UpdateRecordSchema = CreateRecordSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Atleast one filed is requied' }
);

//filter record schema
export const filterRecordSchema = z.object({
  type: z.enum(recordTypeEnum.enumValues).optional(),
  category: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "endDate must be YYYY-MM-DD")
    .optional(),
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be at least 1")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100, "Limit cannot exceed 100")
    .default(20),

}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true; 
  },
  { message: "startDate must be before or equal to endDate" }
)


export type CreateRecordDto = z.infer<typeof CreateRecordSchema>;
export type UpdateRecordDto = z.infer<typeof UpdateRecordSchema>;
export type FilterRecordDto = z.infer<typeof filterRecordSchema>;