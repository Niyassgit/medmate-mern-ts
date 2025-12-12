export interface IProduct {
  id: string;
  repId: string;
  name: string;
  brand: string;
  imageUrl: string[];
  ingredients: string[];
  // useCase: string[];
  mrp: number;
  ptr: number;
  territoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
