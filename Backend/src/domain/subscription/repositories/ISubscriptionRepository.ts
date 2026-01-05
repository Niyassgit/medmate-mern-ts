import { ISubscription } from "../entities/ISubscription";

export interface ISubscriptionRepository {
  findSubscriptionById(subscriptionId: string): Promise<ISubscription | null>;
  getAllSubscriptions(): Promise<ISubscription[]>;
  createSubscription(
    data: Omit<ISubscription, "id" | "createdAt" | "updatedAt" | "isActive">
  ): Promise<ISubscription>;
  updateSubscriptionPlan(
    subscriptionId: string,
    data: Omit<ISubscription, "id" | "createdAt" | "updatedAt" | "isActive">
  ): Promise<ISubscription>;
  toggleListStatus(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscription>;
  deleteSubscriptionById(subscriptionId: string): Promise<void>;
}
