import { PrismaClient } from "@prisma/client";
import { PrismaModel } from "./PrismaModel";
import { FindManyArgs } from "../types/FindManyArgs";

export class BaseRepository<
  TDomain extends { id: string},
  TPersistence extends { id: string },
  TCreateInput extends Record<string, unknown>,
  K extends keyof PrismaClient
> {
  protected model: PrismaModel<TPersistence>;
  protected toDomain: (p: TPersistence) => TDomain;

  constructor(model: PrismaClient[K], toDomain: (p: TPersistence) => TDomain) {
    this.model = model as unknown as PrismaModel<TPersistence>;
    this.toDomain = toDomain;
  }

    async findById(id: string): Promise<TDomain | null> {
    const entity = await this.model.findUnique({ where: { id } as Partial<TPersistence>});
    return entity ? this.toDomain(entity) : null;
  }
  async findAll(args?: FindManyArgs<TPersistence>): Promise<TDomain[]> {
    const entities = await this.model.findMany(args ?? {});
    return entities.map(this.toDomain);
  }

  async create(data: TCreateInput): Promise<TDomain> {
  const created = await this.model.create({ data });
  return this.toDomain(created);
}

  async update(
    id: string,
    data: Partial<TPersistence>
  ): Promise<TDomain | null> {
    const updated = await this.model.update({ where: { id } as Partial<TPersistence>, data });
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    await this.model.delete({ where: { id } as Partial<TPersistence> });
    return true;
  }
}
