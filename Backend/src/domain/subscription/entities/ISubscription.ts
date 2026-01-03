export interface ISubscription {
  id: string;
  name: string;
  description: string;
  price: number;
  tenure: string;
  features: string[]; 
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  repIds?: string[];
}
