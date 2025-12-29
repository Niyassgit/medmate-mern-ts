# Subscription Plan Setup & Integration Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [How It Works](#how-it-works)
5. [Integration Steps](#integration-steps)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide explains how to set up and use the feature-based subscription system in MedMate. The system allows admins to:
- Create and manage features (e.g., VIDEO_CALL, ANALYTICS, PREMIUM_SUPPORT)
- Create subscription plans with selected features
- Update plans and their features
- Users subscribe to plans and get access to specific features

---

## 🏗️ Architecture

### Database Schema

```
Feature (Master List)
├── id: string (unique)
├── key: string (unique, e.g., "VIDEO_CALL")
├── description: string
└── createdAt: DateTime

SubscriptionPlan
├── id: string
├── name: string
├── description: string
├── price: number
├── tenure: string (Monthly/Quarterly/Yearly)
├── isActive: boolean
└── features: PlanFeature[] (many-to-many)

PlanFeature (Junction Table)
├── id: string
├── planId: string → SubscriptionPlan
└── featureId: string → Feature
```

### Data Flow

1. **Admin creates Features** → Stored in `Feature` table
2. **Admin creates Subscription Plan** → Stored in `SubscriptionPlan` table
3. **Admin selects Features for Plan** → Creates `PlanFeature` records (many-to-many)
4. **User subscribes to Plan** → Gets access to all features in that plan

---

## 🚀 Setup Instructions

### Step 1: Create Features First

**Before creating subscription plans, you MUST create features:**

1. Navigate to `/admin/feature-management`
2. Click "Create New Feature"
3. Fill in:
   - **Feature Key**: Unique identifier (e.g., `VIDEO_CALL`, `ANALYTICS`, `PREMIUM_SUPPORT`)
   - **Description**: What this feature enables
4. Click "Create Feature"
5. Repeat for all features you need

**Example Features:**
```
VIDEO_CALL - "Enable video call functionality"
ANALYTICS - "Access to advanced analytics dashboard"
PREMIUM_SUPPORT - "24/7 priority customer support"
ADVANCED_REPORTING - "Generate detailed reports"
UNLIMITED_STORAGE - "Unlimited file storage"
```

### Step 2: Create Subscription Plans

1. Navigate to `/admin/subscription-management`
2. Fill in the form:
   - **Plan Name**: e.g., "Basic", "Premium", "Enterprise"
   - **Price**: Amount in ₹ (e.g., 999)
   - **Billing Period**: Monthly, Quarterly, or Yearly
   - **Description**: Plan description
   - **Features**: Select features from the checkbox list
3. Click "Add Plan"

### Step 3: Verify Plan Creation

- Check that the plan appears in "Your Plans" section
- Click on a plan card to see details
- Verify features are correctly associated

---

## 🔄 How It Works

### Creating a Subscription Plan

```
Frontend Flow:
1. Admin selects features (checkboxes)
2. Frontend sends feature IDs array: ["featureId1", "featureId2"]
3. Backend receives CreateSubscriptionDTO with feature IDs
4. Backend creates SubscriptionPlan
5. Backend creates PlanFeature records linking plan to features
6. Backend returns SubscriptionDTO with feature keys (for display)

Backend Flow:
1. Validate request (name, price, features, etc.)
2. Map DTO to ISubscription entity
3. Create SubscriptionPlan with nested PlanFeature creation
4. Return created plan with features
```

### Updating a Subscription Plan

```
1. Admin edits plan and changes features
2. Frontend sends updated feature IDs
3. Backend:
   - Deletes all existing PlanFeature records
   - Creates new PlanFeature records with updated features
   - Updates plan details (name, price, etc.)
4. Returns updated plan
```

### Feature Mapping

**Important:** The system uses two representations:
- **Feature IDs**: Used internally and in API requests (MongoDB ObjectIds)
- **Feature Keys**: Used for display (e.g., "VIDEO_CALL")

**Mapping happens automatically:**
- When creating/updating: Frontend sends IDs → Backend stores IDs
- When reading: Backend returns keys → Frontend displays keys
- When editing: Frontend receives keys → Maps to IDs → Sends IDs back

---

## 🔌 Integration Steps

### 1. Frontend Integration

#### Check User's Subscription Features

```typescript
// In your component or hook
import { api } from "@/services/api";

const checkUserFeature = async (featureKey: string) => {
  try {
    // Get user's subscription
    const response = await api.get("/rep/subscription/status");
    const subscription = response.data.data;
    
    if (!subscription || !subscription.planId) {
      return false;
    }
    
    // Get plan details with features
    const planResponse = await api.get(`/admin/subscriptions/${subscription.planId}`);
    const plan = planResponse.data.data;
    
    // Check if plan has the feature
    return plan.features.includes(featureKey);
  } catch (error) {
    return false;
  }
};

// Usage
const hasVideoCall = await checkUserFeature("VIDEO_CALL");
if (hasVideoCall) {
  // Show video call button
}
```

#### Create a Feature Check Hook

```typescript
// hooks/useFeatureCheck.ts
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export const useFeatureCheck = (featureKey: string) => {
  const [hasFeature, setHasFeature] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      try {
        const response = await api.get("/rep/subscription/status");
        const subscription = response.data.data;
        
        if (subscription?.planId) {
          const planResponse = await api.get(`/admin/subscriptions/${subscription.planId}`);
          const plan = planResponse.data.data;
          setHasFeature(plan.features?.includes(featureKey) || false);
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

// Usage in component
const { hasFeature, loading } = useFeatureCheck("VIDEO_CALL");
if (hasFeature) {
  return <VideoCallButton />;
}
```

### 2. Backend Integration

#### Add Feature Check Middleware

```typescript
// middleware/CheckFeature.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../infrastructure/database/prisma";

export const checkFeature = (featureKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id; // Assuming you have user in request
      
      // Get user's subscription
      const user = await prisma.medicalRep.findUnique({
        where: { id: userId },
        include: {
          subscriptionPlan: {
            include: {
              features: {
                include: { feature: true }
              }
            }
          }
        }
      });

      if (!user?.subscriptionPlan) {
        return res.status(403).json({
          success: false,
          message: "No active subscription found"
        });
      }

      // Check if plan has the feature
      const hasFeature = user.subscriptionPlan.features.some(
        (pf) => pf.feature.key === featureKey
      );

      if (!hasFeature) {
        return res.status(403).json({
          success: false,
          message: `Feature ${featureKey} is not available in your plan`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking feature access"
      });
    }
  };
};

// Usage in routes
router.post(
  "/video-call",
  Authenticate,
  checkFeature("VIDEO_CALL"),
  videoCallController.createCall
);
```

### 3. UI Integration Examples

#### Conditional Feature Rendering

```tsx
// components/FeatureGate.tsx
import { useFeatureCheck } from "@/hooks/useFeatureCheck";

interface FeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate = ({ 
  featureKey, 
  children, 
  fallback = null 
}: FeatureGateProps) => {
  const { hasFeature, loading } = useFeatureCheck(featureKey);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasFeature) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Usage
<FeatureGate 
  featureKey="VIDEO_CALL"
  fallback={<UpgradePrompt />}
>
  <VideoCallButton />
</FeatureGate>
```

#### Feature-Based Navigation

```tsx
// In your navigation component
const { hasVideoCall } = useFeatures();

const menuItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/analytics", label: "Analytics", feature: "ANALYTICS" },
  { path: "/video-call", label: "Video Call", feature: "VIDEO_CALL" },
  { path: "/reports", label: "Reports", feature: "ADVANCED_REPORTING" },
].filter(item => !item.feature || hasFeature(item.feature));
```

---

## 📡 API Reference

### Create Subscription Plan

**Endpoint:** `POST /admin/subscriptions/create`

**Request:**
```json
{
  "name": "Premium Plan",
  "description": "Full access to all features",
  "price": 999,
  "tenure": "Monthly",
  "features": ["featureId1", "featureId2", "featureId3"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "planId",
    "name": "Premium Plan",
    "description": "Full access to all features",
    "price": 999,
    "tenure": "Monthly",
    "features": ["VIDEO_CALL", "ANALYTICS", "PREMIUM_SUPPORT"],
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Subscription plan created successfully"
}
```

### Update Subscription Plan

**Endpoint:** `PATCH /admin/subscription/update/:subscriptionId`

**Request:** Same as create

**Response:** Updated plan data

### Get All Features

**Endpoint:** `GET /admin/features/list`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "featureId1",
      "key": "VIDEO_CALL",
      "description": "Enable video call functionality",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Issue: Features not saving when creating plan

**Solution:**
1. Ensure features are created first
2. Check that feature IDs are valid MongoDB ObjectIds
3. Verify backend logs for errors
4. Check database for PlanFeature records

### Issue: Features not updating

**Solution:**
1. Verify updateSubscriptionPlan method deletes old PlanFeatures
2. Check that new PlanFeatures are created
3. Ensure feature IDs are sent correctly from frontend

### Issue: Feature check not working

**Solution:**
1. Verify user has active subscription
2. Check subscription plan includes the feature
3. Verify feature key matches exactly (case-sensitive)
4. Check database relationships

### Issue: Plan creation fails

**Solution:**
1. Check validation errors in request
2. Verify all required fields are present
3. Ensure at least one feature is selected
4. Check price is positive number
5. Verify tenure is valid (Monthly/Quarterly/Yearly)

---

## ✅ Best Practices

1. **Always create features first** before creating plans
2. **Use descriptive feature keys** (e.g., `VIDEO_CALL` not `VC`)
3. **Keep feature keys consistent** across the application
4. **Validate feature access** on both frontend and backend
5. **Cache feature checks** to reduce API calls
6. **Handle subscription expiration** gracefully
7. **Provide upgrade prompts** when features are unavailable

---

## 📝 Example Workflow

1. **Admin creates features:**
   - VIDEO_CALL
   - ANALYTICS
   - PREMIUM_SUPPORT

2. **Admin creates "Basic Plan":**
   - Price: ₹499/month
   - Features: [VIDEO_CALL]

3. **Admin creates "Premium Plan":**
   - Price: ₹999/month
   - Features: [VIDEO_CALL, ANALYTICS, PREMIUM_SUPPORT]

4. **User subscribes to Basic Plan:**
   - Gets access to VIDEO_CALL only
   - Cannot access ANALYTICS or PREMIUM_SUPPORT

5. **User upgrades to Premium Plan:**
   - Gets access to all features
   - Can use VIDEO_CALL, ANALYTICS, and PREMIUM_SUPPORT

---

## 🎯 Next Steps

1. Implement feature checks in your components
2. Add upgrade prompts for premium features
3. Create subscription management UI for users
4. Add analytics for feature usage
5. Implement subscription renewal reminders

---

**Need Help?** Check the codebase or contact the development team.

