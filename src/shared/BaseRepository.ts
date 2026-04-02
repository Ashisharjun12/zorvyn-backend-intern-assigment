import { ApiError } from "./ApiError.js";

export abstract class BaseRepository<TSelect, TInsert> {
 
  abstract findById(id: string): Promise<TSelect | undefined>;
  abstract findAll(): Promise<TSelect[]>;
  abstract create(data: TInsert): Promise<TSelect>;
  abstract update(id: string, data: Partial<TInsert>): Promise<TSelect>;
  abstract softDelete(id: string): Promise<void>;


  protected assertExists(
    entity: TSelect | undefined,
    name: string
  ): asserts entity is TSelect {
    if (!entity) throw ApiError.notFound(`${name} not found`);
  }
}