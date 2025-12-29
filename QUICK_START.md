# Quick Start Guide - Subscription Plans

## 🚀 Setup in 3 Steps

### Step 1: Create Features (Required First!)
```
1. Go to: /admin/feature-management
2. Click "Create New Feature"
3. Add features like:
   - VIDEO_CALL
   - ANALYTICS  
   - PREMIUM_SUPPORT
```

### Step 2: Create Subscription Plan
```
1. Go to: /admin/subscription-management
2. Fill form:
   - Name: "Premium Plan"
   - Price: 999
   - Tenure: Monthly
   - Select features from checklist
3. Click "Add Plan"
```

### Step 3: Verify
```
- Check plan appears in "Your Plans"
- Verify features are listed correctly
- Test plan creation/update
```

## ✅ What Was Fixed

1. **Backend Create API** - Now returns full plan data with features
2. **Backend Update API** - Properly updates features (deletes old, creates new)
3. **Frontend** - Handles responses correctly
4. **Feature Management** - Full CRUD operations

## 🔍 Testing Checklist

- [ ] Create a feature
- [ ] Create a plan with features
- [ ] Update plan features
- [ ] Delete a plan
- [ ] Verify features are saved correctly
- [ ] Check API responses

## 📝 API Endpoints

```
POST   /admin/subscriptions/create
PATCH  /admin/subscription/update/:id
GET    /admin/subscriptions
GET    /admin/features/list
POST   /admin/features/create
PUT    /admin/features/update/:id
DELETE /admin/features/delete/:id
```

## ⚠️ Important Notes

1. **Always create features BEFORE creating plans**
2. **Feature IDs are sent to backend, keys are returned**
3. **Features are case-sensitive** (VIDEO_CALL ≠ video_call)
4. **At least one feature is required** per plan

