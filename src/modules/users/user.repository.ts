import { eq } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { users } from './user.schema.js';
import { ApiError } from '../../shared/ApiError.js';
import type { UserSelect, UserInsert } from './user.schema.js';
import type { IUserRepository } from './user.interface.js';


export class UserRepository implements IUserRepository {

  //get all users
  async findAll(): Promise<UserSelect[]> {
    return await db.select().from(users);
  }

  //get user by id
  async findById(id: string): Promise<UserSelect | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  //get user by email
  async findByEmail(email: string): Promise<UserSelect | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  //create
  async create(data: UserInsert): Promise<UserSelect> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();
    return user;
  }

  //update user
  async update(id: string, data: Partial<UserInsert>): Promise<UserSelect> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!updated) throw ApiError.notFound('User not found');
    return updated;
  }

  //softdelete user
  async softDelete(id: string): Promise<void> {
    await db
      .update(users)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(users.id, id));
  }
}
