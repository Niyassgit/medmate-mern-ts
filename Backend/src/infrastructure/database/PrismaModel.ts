export type PrismaModel<T extends { id: string }> = {
  findUnique(args: { where: Partial<T> }): Promise<T | null>;
  findMany(args?: {
    where?: Partial<T>;
    orderBy?: Record<string, "asc" | "desc">;
  }): Promise<T[]>;
  create(args: { data: Record<string, unknown> }): Promise<T>;
  update(args: { where: Partial<T>; data: Partial<T> }): Promise<T>;
  delete(args: { where: Partial<T> }): Promise<void>;
};
