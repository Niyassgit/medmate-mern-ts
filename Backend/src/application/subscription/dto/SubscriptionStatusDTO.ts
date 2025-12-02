export interface SubscriptionStatusDTO {
  isActive: boolean;
  planId: string | null;
  startDate: Date | null;
  endDate: Date | null;
}
