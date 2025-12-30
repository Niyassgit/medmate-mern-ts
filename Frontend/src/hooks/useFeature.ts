import { useAppSelector } from "@/app/hooks";
import { Feature } from "@/types/SubscriptionStatus";

export const useFeature = (feature: Feature | string): boolean => {
  const features = useAppSelector((state) => state.subscription.features);
  return !!features[feature];
};

export const useFeatures = (
  features: (Feature | string)[]
): Record<string, boolean> => {
  const subscriptionFeatures = useAppSelector(
    (state) => state.subscription.features
  );

  const result: Record<string, boolean> = {};
  features.forEach((feature) => {
    result[feature] = !!subscriptionFeatures[feature];
  });

  return result;
};

export const useSubscription = () => {
  return useAppSelector((state) => state.subscription);
};
