export type FindManyArgs<T> = {
  where?: Partial<T>;
  orderBy?: Record<string, "asc" | "desc">;
};
