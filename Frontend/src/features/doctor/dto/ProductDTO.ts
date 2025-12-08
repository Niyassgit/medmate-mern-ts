export interface ProductDTO {
  id: string;
  name: string;
  brand: string;
  imageUrls: string[] | null;
  ingredients: string[];
  useCase: string[];
  mrp: number;
  ptr: number;
  territoryIds: string[];
  territoryNames?: string[];
}

