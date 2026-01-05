import { api } from "@/services/api";
import { RepEndpoints } from "@/services/endpoints/RepEndpoints";
import { SubscriptionStatusDTO } from "../rep/dto/SubscriptionStatusDTO";
import { SubscriptionPlan } from "./subscriptionSlice";


export const getSubscriptionStatus = async (): Promise<SubscriptionStatusDTO> => {
  const res = await api.get(RepEndpoints.SUBSCRIPTION_STATUS);
  return res.data.data;
};

export const getAllSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const res = await api.get(RepEndpoints.SUBCSRIPTION_PLANS);
  return res.data.data || [];
};

export const getSubscriptionPlan = async (planId: string): Promise<SubscriptionPlan | null> => {
  try {
    const plans = await getAllSubscriptionPlans();
    const plan = plans.find((p: SubscriptionPlan) => p.id === planId);
    return plan || null;
  } catch (error) {
    console.error("Failed to fetch plan details:", error);
    return null;
  }
};

export const fetchSubscriptionData = async (): Promise<{
  status: SubscriptionStatusDTO;
  plan: SubscriptionPlan | null;
}> => {
  const status = await getSubscriptionStatus();
  
  let plan: SubscriptionPlan | null = null;
  if (status.planId) {
    plan = await getSubscriptionPlan(status.planId);
  }
  
  return { status, plan };
};

