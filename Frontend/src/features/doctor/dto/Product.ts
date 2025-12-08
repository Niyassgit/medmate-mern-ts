export interface Product {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  lastOrdered?: string;
  stock: number;
}