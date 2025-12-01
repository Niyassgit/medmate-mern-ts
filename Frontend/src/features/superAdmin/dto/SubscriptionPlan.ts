export interface SubscriptionPlanPayload {
  name: string;
  description: string;
  price: number;
  tenure: string;
  features: string[];
}

export interface SubscriptionPlan extends SubscriptionPlanPayload {
  isActive: boolean;
  reps?: string[];
}
