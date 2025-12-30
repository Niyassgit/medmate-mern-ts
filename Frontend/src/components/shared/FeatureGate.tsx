import { ReactNode } from "react";
import { useFeature } from "@/hooks/useFeature";
import { useSubscription } from "@/hooks/useFeature";
import { Feature } from "@/types/SubscriptionStatus";

interface FeatureGateProps {
  feature: Feature | string;
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: boolean;
}

export const FeatureGate = ({
  feature,
  children,
  fallback = null,
  showLoading = false,
}: FeatureGateProps) => {
  const hasFeature = useFeature(feature);
  const { loading } = useSubscription();

  if (showLoading && loading) {
    return <div>Loading...</div>;
  }

  if (!hasFeature) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
