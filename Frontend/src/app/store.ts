import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import subscriptionReducer from "../features/subscription/subscriptionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
