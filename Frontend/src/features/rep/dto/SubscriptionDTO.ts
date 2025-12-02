export interface SubscriptionDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  tenure: string;
  features: string[];
  isActive:boolean,
  createdAt: Date;
  updatedAt: Date;
}