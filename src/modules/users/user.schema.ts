import { pgTable, pgEnum, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const userRoleEnum = pgEnum('user_role', ['viewer', 'analyst', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive']);


export type UserRole = typeof userRoleEnum.enumValues[number];
export type UserStatus = typeof userStatusEnum.enumValues[number];

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password').notNull(),
    role: userRoleEnum('role').default('viewer').notNull(),
    status: userStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('users_email_idx').on(t.email),
  ]
);

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;



// zod validation

// Register
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name must be at most 100 characters long'),
  email: z.email('Invalid Email'),
  password: z.string().min(4),

});


//Login
export const LoginSchema = z.object({
  email: z.email('Invalid Email'),
  password: z.string().min(4),
});

//Update User
export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional()
}).refine((d) => Object.keys(d).length > 0, "Atleast one field is required")


//update role
export const UpdateRoleSchema = z.object({
  role: z.enum(userRoleEnum.enumValues),
});

//update status
export const UpdateStatusSchema = z.object({
  status: z.enum(userStatusEnum.enumValues),
});



export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
export type UpdateStatusDto = z.infer<typeof UpdateStatusSchema>;