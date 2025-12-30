import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchSubscription } from "@/features/subscription/subscriptionThunks";
import { clearSubscription } from "@/features/subscription/subscriptionSlice";
import { Role } from "@/types/Role";


export const useSubscriptionInit = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { planId } = useAppSelector((state) => state.subscription);

  useEffect(() => {
    if (user?.role === Role.MEDICAL_REP) {
      if (!planId) {
        dispatch(fetchSubscription());
      }
    } else {
      dispatch(clearSubscription());
    }
  }, [user?.role, dispatch, planId]);
};

