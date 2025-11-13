type DefaultCreateInput<T> = T extends { id: string; createdAt: Date; updatedAt: Date }
  ? Omit<T, "id" | "createdAt" | "updatedAt">
  : Omit<T, "id">;

export interface IBaseRepository<
  TDomain,
  TCreateInput = DefaultCreateInput<TDomain>,
  TUpdateInput = Partial<TDomain>,
  TFindManyArgs = unknown
> {
  findById(id: string): Promise<TDomain | null>;
  findAll(args?: TFindManyArgs): Promise<TDomain[]>;
  create(data: TCreateInput): Promise<TDomain>;
  update(id: string, data: TUpdateInput): Promise<TDomain | null>;
  delete(id: string): Promise<boolean>;
}