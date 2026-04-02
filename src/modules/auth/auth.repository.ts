import { eq } from 'drizzle-orm';
import { db }  from '../../config/database.js';
import { users } from '../../db/schema.js';
import { BaseRepository } from '../../shared/BaseRepository.js';
import type { UserSelect, UserInsert } from '../users/user.schema.js';
import type { IAuthRepository } from './auth.interface.js';


export class AuthRepository extends BaseRepository<UserSelect, UserInsert> implements IAuthRepository {

  //find user by id
  async findById(id: string): Promise<UserSelect | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  //find user by email
  async findByEmail(email: string): Promise<UserSelect | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  //find all users
  async findAll(): Promise<UserSelect[]> {
    return await db.select().from(users);
  }

  // create
  async create(data: UserInsert): Promise<UserSelect> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();
    return user;
  }

  //create user
  async createUser(data: Pick<UserInsert, 'name' | 'email' | 'password'>): Promise<UserSelect> {
    return this.create(data as UserInsert);
  }

  //update user
  async update(id: string, data: Partial<UserInsert>): Promise<UserSelect> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    this.assertExists(user, 'User');
    return user;
  }


  //soft delete
  async softDelete(id: string): Promise<void> {
    await db
      .update(users)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(users.id, id));
  }
}
