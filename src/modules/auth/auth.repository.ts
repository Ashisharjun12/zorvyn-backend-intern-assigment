import { eq } from 'drizzle-orm';
import { db }  from '../../config/database.js';
import { users } from '../../db/schema.js';
import type { UserSelect, UserInsert } from '../users/user.schema.js';
import type { IAuthRepository } from './auth.interface.js';


export class AuthRepository implements IAuthRepository {

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

  //create
  async create(data: UserInsert): Promise<UserSelect> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();
    return user;
  }
}
