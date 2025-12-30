export interface ISubscription {
  id: string;
  name: string;
  description: string;
  price: number;
  tenure: string;
  features: string[]; // Feature keys (e.g., "VIDEO_CALL", "FEED_ENHANCEMENT")
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  repIds?: string[];
}
