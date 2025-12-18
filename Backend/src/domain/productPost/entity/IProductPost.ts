export interface IProductPost {
  id: string;
  repId: string;
  title: string;
  description: string;
  imageUrl: string[];
  brand: string;
  useCases: string[];
  ingredients: string[];
  termsOfUse: string;
  territoryId: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
