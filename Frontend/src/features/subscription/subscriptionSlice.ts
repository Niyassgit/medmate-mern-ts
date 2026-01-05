import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  tenure: string;
  features: string[]; 
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionState {
  planId: string | null;
  plan: SubscriptionPlan | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  features: Record<string, boolean>; 
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  planId: null,
  plan: null,
  isActive: false,
  startDate: null,
  endDate: null,
  features: {},
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionStatus: (
      state,
      action: PayloadAction<{
        planId: string | null;
        isActive: boolean;
        startDate: string | null;
        endDate: string | null;
      }>
    ) => {
      state.planId = action.payload.planId;
      state.isActive = action.payload.isActive;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.loading = false;
      state.error = null;
    },
    setSubscriptionPlan: (
      state,
      action: PayloadAction<SubscriptionPlan>
    ) => {
      state.plan = action.payload;
      const featuresMap: Record<string, boolean> = {};
      action.payload.features.forEach((featureKey) => {
        featuresMap[featureKey] = true;
      });
      state.features = featuresMap;
      state.loading = false;
      state.error = null;
    },
    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubscriptionError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSubscription: (state) => {
      state.planId = null;
      state.plan = null;
      state.isActive = false;
      state.startDate = null;
      state.endDate = null;
      state.features = {};
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSubscriptionStatus,
  setSubscriptionPlan,
  setSubscriptionLoading,
  setSubscriptionError,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

