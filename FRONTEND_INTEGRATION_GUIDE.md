# Frontend Integration Guide - Feature-Based Subscriptions

## ✅ Backend Changes Completed

1. **GetFeedUseCase** - Now checks `FEED_ENHANCEMENT` feature
2. **RepMakeConnectionRequestUseCase** - Now checks `UNLIMITED_CONNECTIONS` feature  
3. **GetConnectionRequestStatsUseCase** - Now checks `UNLIMITED_CONNECTIONS` feature
4. **MakeVideoCallWithDoctorUseCase** - Already checks `VIDEO_CALL` feature ✅

## 🎯 Frontend Changes Required

### 1. **Feature Check Hook** (Required)

Create a hook to check if user has a specific feature:

**File:** `Frontend/src/hooks/useFeatureCheck.ts`

```typescript
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export const useFeatureCheck = (featureKey: string) => {
  const [hasFeature, setHasFeature] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      try {
        // Get user's subscription status
        const response = await api.get("/rep/subscription/status");
        const subscription = response.data.data;
        
        if (subscription?.planId) {
          // Get plan details with features
          const planResponse = await api.get(`/admin/subscriptions/${subscription.planId}`);
          const plan = planResponse.data.data;
          
          // Check if plan has the feature
          setHasFeature(plan.features?.includes(featureKey) || false);
        } else {
          setHasFeature(false);
        }
      } catch (error) {
        setHasFeature(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeature();
  }, [featureKey]);

  return { hasFeature, loading };
};
```

### 2. **Feature Gate Component** (Recommended)

Create a reusable component to conditionally render features:

**File:** `Frontend/src/components/shared/FeatureGate.tsx`

```typescript
import { useFeatureCheck } from "@/hooks/useFeatureCheck";

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

export const FeatureGate = ({ 
  featureKey, 
  children, 
  fallback = null,
  showLoading = false
}: FeatureGateProps) => {
  const { hasFeature, loading } = useFeatureCheck(featureKey);

  if (loading && showLoading) {
    return <div>Loading...</div>;
  }

  if (!hasFeature) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
```

### 3. **Update Video Call Button** (If exists)

**File:** `Frontend/src/features/rep/components/VideoCallButton.tsx` (or wherever video call button is)

```typescript
import { FeatureGate } from "@/components/shared/FeatureGate";
import { Button } from "@/components/ui/button";

export const VideoCallButton = ({ doctorId }: { doctorId: string }) => {
  return (
    <FeatureGate 
      featureKey="VIDEO_CALL"
      fallback={
        <Button disabled>
          Video Call (Upgrade Required)
        </Button>
      }
    >
      <Button onClick={() => handleVideoCall(doctorId)}>
        Start Video Call
      </Button>
    </FeatureGate>
  );
};
```

### 4. **Update Connection Request UI**

**File:** `Frontend/src/features/rep/components/ConnectionRequestButton.tsx`

```typescript
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ConnectionRequestButton = ({ doctorId }: { doctorId: string }) => {
  const { hasFeature: hasUnlimitedConnections, loading } = useFeatureCheck("UNLIMITED_CONNECTIONS");
  
  // Get connection stats
  const { data: stats } = useQuery(['connectionStats'], () => 
    api.get('/rep/connection/stats').then(res => res.data.data)
  );

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  if (!hasUnlimitedConnections && stats?.remaining === 0) {
    return (
      <Alert>
        <AlertDescription>
          Daily connection limit reached. Upgrade your plan for unlimited connections.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Button onClick={() => handleConnectionRequest(doctorId)}>
      {hasUnlimitedConnections ? "Send Connection Request" : `Send Request (${stats?.remaining} remaining)`}
    </Button>
  );
};
```

### 5. **Update Connection Limit Badge**

**File:** `Frontend/src/features/rep/components/ConnectionLimitBadge.tsx`

Update to use feature check:

```typescript
import { useFeatureCheck } from "@/hooks/useFeatureCheck";

export function ConnectionLimitBadge({ 
  used, 
  limit,
}: { 
  used: number; 
  limit: number | null;
}) {
  const { hasFeature: hasUnlimitedConnections } = useFeatureCheck("UNLIMITED_CONNECTIONS");
  
  // Use feature check instead of isSubscribed prop
  const isSubscribed = hasUnlimitedConnections;

  if (isSubscribed || limit === null) {
    return (
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-full">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Premium Subscription</p>
              <p className="text-xs text-gray-600">Unlimited connection requests</p>
            </div>
          </div>
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            ⭐ Premium
          </Badge>
        </div>
      </Card>
    );
  }
  
  // ... rest of the component
}
```

### 6. **Update Feed Page** (Optional - for better UX)

**File:** `Frontend/src/features/doctor/pages/Feed.tsx`

The feed will automatically prioritize posts from reps with `FEED_ENHANCEMENT` feature (handled by backend). But you can add a visual indicator:

```typescript
import { useFeatureCheck } from "@/hooks/useFeatureCheck";

// In your feed item component
const FeedItem = ({ post }: { post: FeedDTO }) => {
  // Note: This checks if CURRENT USER has feature, not the rep
  // For rep's feature, you'd need to check rep's plan separately
  // But backend already sorts by this, so this is optional
  
  return (
    <div>
      {post.rep.isSubscribedRep && (
        <Badge className="bg-blue-500">Premium Rep</Badge>
      )}
      {/* Post content */}
    </div>
  );
};
```

### 7. **Add Feature Check to Navigation** (Optional)

Hide/show menu items based on features:

```typescript
import { useFeatureCheck } from "@/hooks/useFeatureCheck";

const Navigation = () => {
  const { hasFeature: hasVideoCall } = useFeatureCheck("VIDEO_CALL");
  const { hasFeature: hasFeedEnhancement } = useFeatureCheck("FEED_ENHANCEMENT");

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/feed", label: "Feed", feature: "FEED_ENHANCEMENT" },
    { path: "/video-call", label: "Video Call", feature: "VIDEO_CALL" },
  ].filter(item => !item.feature || 
    (item.feature === "VIDEO_CALL" && hasVideoCall) ||
    (item.feature === "FEED_ENHANCEMENT" && hasFeedEnhancement)
  );

  return (
    <nav>
      {menuItems.map(item => (
        <Link key={item.path} to={item.path}>{item.label}</Link>
      ))}
    </nav>
  );
};
```

### 8. **Update Subscription Status API Call**

Make sure your subscription status endpoint returns plan with features:

**File:** `Frontend/src/features/rep/api.ts` (or wherever subscription API is)

```typescript
export const getSubscriptionStatus = async () => {
  const res = await api.get("/rep/subscription/status");
  return res.data.data;
};

// Add new function to get plan details
export const getSubscriptionPlan = async (planId: string) => {
  const res = await api.get(`/admin/subscriptions/${planId}`);
  return res.data.data;
};
```

## 📋 Checklist

- [ ] Create `useFeatureCheck` hook
- [ ] Create `FeatureGate` component
- [ ] Update Video Call button to use feature check
- [ ] Update Connection Request button to use feature check
- [ ] Update Connection Limit Badge to use feature check
- [ ] (Optional) Add visual indicators for premium features
- [ ] (Optional) Update navigation to hide/show features
- [ ] Test all feature checks work correctly

## 🎯 Feature Keys Reference

```typescript
export enum Feature {
  VIDEO_CALL = "VIDEO_CALL",
  FEED_ENHANCEMENT = "FEED_ENHANCEMENT",
  UNLIMITED_CONNECTIONS = "UNLIMITED_CONNECTIONS",
}
```

## ⚠️ Important Notes

1. **Backend Already Enforces** - All feature checks are enforced on backend, so frontend checks are for UX only
2. **Cache Feature Checks** - Consider caching feature checks to reduce API calls
3. **Loading States** - Always show loading states while checking features
4. **Error Handling** - Handle errors gracefully (default to no feature access)
5. **Plan Changes** - If user upgrades/downgrades, refresh feature checks

## 🚀 Quick Start

1. Copy the `useFeatureCheck` hook code above
2. Copy the `FeatureGate` component code above
3. Wrap your video call button with `FeatureGate`
4. Update connection request logic to use feature check
5. Test with different subscription plans

## 📝 Example Usage

```typescript
// Simple usage
const { hasFeature } = useFeatureCheck("VIDEO_CALL");
if (hasFeature) {
  return <VideoCallButton />;
}

// With FeatureGate component
<FeatureGate 
  featureKey="VIDEO_CALL"
  fallback={<UpgradePrompt />}
>
  <VideoCallButton />
</FeatureGate>
```

---

**All backend changes are complete!** The frontend changes above will provide the best user experience by showing/hiding features based on subscription.

