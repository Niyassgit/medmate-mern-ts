import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSubscriptionData } from "./subscriptionApi";
import {
  setSubscriptionStatus,
  setSubscriptionPlan,
  setSubscriptionError,
  setSubscriptionLoading,
} from "./subscriptionSlice";

export const fetchSubscription = createAsyncThunk(
  "subscription/fetch",
  async (_, { dispatch }) => {
    try {
      dispatch(setSubscriptionLoading(true));
      const { status, plan } = await fetchSubscriptionData();

      dispatch(
        setSubscriptionStatus({
          planId: status.planId,
          isActive: status.isActive,
          startDate: status.startDate,
          endDate: status.endDate,
        })
      );

      if (plan) {
        dispatch(setSubscriptionPlan(plan));
      }

      return { status, plan };
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to fetch subscription";
      dispatch(setSubscriptionError(errorMessage));
      throw error;
    }
  }
);
