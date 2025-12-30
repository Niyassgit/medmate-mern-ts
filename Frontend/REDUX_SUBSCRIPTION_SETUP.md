# Redux Subscription Setup Guide

## ✅ Implementation Complete

The Redux Toolkit pattern for subscription management has been fully implemented. This follows the recommended pattern of:
1. **Fetch Once** (on app init / login)
2. **Store in Redux**
3. **Lightweight Hooks** (NO API calls)

---

## 📁 Files Created/Modified

### New Files Created:
1. **`Frontend/src/features/subscription/subscriptionSlice.ts`**
   - Redux slice for subscription state
   - Includes `Feature` enum
   - Manages subscription status, plan, and features map

2. **`Frontend/src/features/subscription/subscriptionApi.ts`**
   - API functions for fetching subscription data
   - `fetchSubscriptionData()` - Main function to call on app init

3. **`Frontend/src/features/subscription/subscriptionThunks.ts`**
   - Redux thunk for async subscription fetching
   - `fetchSubscription()` - Thunk to dispatch

4. **`Frontend/src/hooks/useFeature.ts`**
   - Lightweight hooks for feature checking
   - `useFeature(feature)` - Check single feature
   - `useFeatures(features[])` - Check multiple features
   - `useSubscription()` - Get full subscription state

5. **`Frontend/src/hooks/useSubscriptionInit.ts`**
   - Hook to initialize subscription on app load
   - Automatically fetches for MEDICAL_REP role

6. **`Frontend/src/components/shared/FeatureGate.tsx`**
   - Component for conditional rendering based on features
   - No API calls - reads from Redux

7. **`Frontend/src/app/hooks.ts`**
   - Typed Redux hooks (`useAppSelector`, `useAppDispatch`)

### Modified Files:
1. **`Frontend/src/app/store.ts`**
   - Added `subscription` reducer

2. **`Frontend/src/features/auth/pages/LoginPage.tsx`**
   - Fetches subscription after login for MEDICAL_REP

3. **`Frontend/src/features/auth/components/GoogleAuthButton.tsx`**
   - Fetches subscription after Google login for MEDICAL_REP

4. **`Frontend/src/features/rep/components/RepLayout.tsx`**
   - Uses `useSubscriptionInit()` to ensure subscription is loaded

5. **`Frontend/src/components/shared/LogoutButton.tsx`**
   - Clears subscription on logout

6. **`Frontend/src/features/auth/components/LogoutFn.tsx`**
   - Clears subscription on logout

---

## 🚀 How to Use

### 1. Check if User Has a Feature

```tsx
import { useFeature } from "@/hooks/useFeature";
import { Feature } from "@/features/subscription/subscriptionSlice";

const MyComponent = () => {
  const hasVideoCall = useFeature(Feature.VIDEO_CALL);
  
  if (hasVideoCall) {
    return <VideoCallButton />;
  }
  
  return <UpgradePrompt />;
};
```

### 2. Use FeatureGate Component

```tsx
import { FeatureGate } from "@/components/shared/FeatureGate";
import { Feature } from "@/features/subscription/subscriptionSlice";

const MyComponent = () => {
  return (
    <FeatureGate 
      feature={Feature.VIDEO_CALL}
      fallback={<UpgradePrompt />}
    >
      <VideoCallButton />
    </FeatureGate>
  );
};
```

### 3. Check Multiple Features

```tsx
import { useFeatures } from "@/hooks/useFeature";
import { Feature } from "@/features/subscription/subscriptionSlice";

const MyComponent = () => {
  const { VIDEO_CALL, UNLIMITED_CONNECTIONS } = useFeatures([
    Feature.VIDEO_CALL,
    Feature.UNLIMITED_CONNECTIONS,
  ]);
  
  return (
    <div>
      {VIDEO_CALL && <VideoCallButton />}
      {UNLIMITED_CONNECTIONS && <UnlimitedBadge />}
    </div>
  );
};
```

### 4. Get Full Subscription State

```tsx
import { useSubscription } from "@/hooks/useFeature";

const MyComponent = () => {
  const { plan, isActive, features, loading } = useSubscription();
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      <p>Plan: {plan?.name}</p>
      <p>Active: {isActive ? "Yes" : "No"}</p>
    </div>
  );
};
```

### 5. Manually Refresh Subscription

```tsx
import { useAppDispatch } from "@/app/hooks";
import { fetchSubscription } from "@/features/subscription/subscriptionThunks";

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  const handleRefresh = () => {
    dispatch(fetchSubscription());
  };
  
  return <button onClick={handleRefresh}>Refresh Subscription</button>;
};
```

---

## 🔄 Data Flow

1. **On Login** (LoginPage.tsx / GoogleAuthButton.tsx):
   - User logs in
   - `dispatch(fetchSubscription())` is called for MEDICAL_REP
   - Subscription data is fetched and stored in Redux

2. **On App Load** (RepLayout.tsx):
   - `useSubscriptionInit()` hook runs
   - If user is MEDICAL_REP and no subscription data exists, fetches it
   - Otherwise clears subscription for non-rep users

3. **In Components**:
   - Components use `useFeature()` or `FeatureGate`
   - Reads from Redux store (instant, no API calls)
   - UI updates based on feature availability

4. **On Logout**:
   - Subscription state is cleared
   - Redux store is reset

---

## 📊 Redux State Structure

```typescript
{
  subscription: {
    planId: string | null;
    plan: SubscriptionPlan | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    features: {
      VIDEO_CALL: boolean;
      FEED_ENHANCEMENT: boolean;
      UNLIMITED_CONNECTIONS: boolean;
      // ... other features
    };
    loading: boolean;
    error: string | null;
  }
}
```

---

## 🎯 Available Features

Features are defined in `subscriptionSlice.ts`:

```typescript
export enum Feature {
  VIDEO_CALL = "VIDEO_CALL",
  FEED_ENHANCEMENT = "FEED_ENHANCEMENT",
  UNLIMITED_CONNECTIONS = "UNLIMITED_CONNECTIONS",
}
```

---

## ⚠️ Important Notes

1. **Backend Still Enforces Security**: The frontend Redux store is for UX only. The backend always validates features before allowing actions.

2. **Only for MEDICAL_REP**: Subscription features are only relevant for medical reps. Other roles will have empty subscription state.

3. **Automatic Fetching**: Subscription is automatically fetched:
   - After login (if MEDICAL_REP)
   - On RepLayout mount (if not already loaded)

4. **Manual Refresh**: You can manually refresh subscription by dispatching `fetchSubscription()` thunk.

5. **No Duplicate API Calls**: The `useSubscriptionInit` hook checks if subscription data already exists before fetching.

---

## 🔧 Troubleshooting

### Subscription not loading?
- Check if user role is `MEDICAL_REP`
- Check browser console for API errors
- Verify `RepEndpoints.SUBSCRIPTION_STATUS` endpoint is working
- Check Redux DevTools to see if actions are dispatched

### Features always false?
- Verify subscription is active (`isActive: true`)
- Check if subscription has expired (`endDate`)
- Verify plan has the feature in `plan.features` array
- Check Redux store state in DevTools

### Need to refresh after subscription purchase?
- After successful checkout, dispatch `fetchSubscription()` to refresh state

---

## 📝 Next Steps

1. **Update existing components** that check subscription to use `useFeature()` hook
2. **Replace old `useFeatureCheck` hook** with new `useFeature` hook
3. **Add FeatureGate** to components that conditionally show features
4. **Test subscription flow** end-to-end

---

## ✅ Benefits

- ⚡ **Instant**: No API calls per component
- 🎯 **Centralized**: Single source of truth in Redux
- 🔄 **Reactive**: Components automatically update when subscription changes
- 🧹 **Clean**: No duplicate API calls
- 🛡️ **Type-safe**: Full TypeScript support
- 🎨 **UX-friendly**: Fast UI updates without loading states

