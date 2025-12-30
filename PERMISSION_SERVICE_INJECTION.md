# PermissionService Injection Guide

## Current Usage

### Static Method (Currently Used - No Injection Needed)

The static method `hasFeatureForRep` is being called directly in use cases:

**Files using static method:**
1. `RepMakeConnectionRequestUseCase.ts` - Line 93
2. `GetConnectionRequestStatsUseCase.ts` - Line 35
3. `SortPostBySubscription.ts` - Line 21

**Example:**
```typescript
// In RepMakeConnectionRequestUseCase.ts
const hasUnlimitedConnections = await PermissionService.hasFeatureForRep(
  repDetails,
  Feature.UNLIMITED_CONNECTIONS,
  this._subscriptionRepository  // Repository passed as parameter
);
```

**Why no injection needed?**
- Static methods don't need instance injection
- Repository is passed as parameter (dependency injection at method level)

### Instance Method (Not Currently Used - Needs Injection)

The instance method `hasFeature(userId, featureKey)` is **NOT currently used** anywhere.

**If you want to use it, you need to inject PermissionService:**

## How to Inject PermissionService

### Option 1: Create DI File (Recommended)

**File:** `Backend/src/infrastructure/di/PermissionServiceDI.ts`

```typescript
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { PermissionService } from "../../application/common/services/PermissionService";

const medicalRepRepository = new MedicalRepRepository();
const subscriptionRepository = new SubscriptionRepository();

export const permissionService = new PermissionService(
  subscriptionRepository,
  medicalRepRepository
);
```

### Option 2: Inject in Use Cases (If Needed)

If you want to use the instance method `hasFeature`, inject it in use cases:

**Example Use Case:**
```typescript
import { PermissionService } from "../../common/services/PermissionService";

export class SomeUseCase {
  constructor(
    private _permissionService: PermissionService,  // Injected
    // ... other dependencies
  ) {}

  async execute(userId: string) {
    // Use instance method
    const hasFeature = await this._permissionService.hasFeature(
      userId,
      "VIDEO_CALL"
    );
  }
}
```

**Then in DI file:**
```typescript
import { permissionService } from "./PermissionServiceDI";

const someUseCase = new SomeUseCase(
  permissionService,  // Inject here
  // ... other dependencies
);
```

## Current Architecture

### ✅ What's Working (Static Method)

```
Use Case
  ↓
PermissionService.hasFeatureForRep(rep, featureKey, repository)
  ↓
Repository (passed as parameter)
```

**Benefits:**
- No DI needed
- Flexible - can pass any repository implementation
- Follows dependency injection at method level

### 🔄 Alternative (Instance Method - If Needed)

```
DI File
  ↓
PermissionService instance (with repositories injected)
  ↓
Use Case (PermissionService injected)
  ↓
permissionService.hasFeature(userId, featureKey)
```

**Benefits:**
- Single instance (singleton pattern)
- Cleaner use case code
- Follows dependency injection at constructor level

## Recommendation

**Keep using static method** because:
1. ✅ Already working
2. ✅ No DI setup needed
3. ✅ More flexible (can pass different repositories)
4. ✅ Follows SOLID principles (depends on abstraction via parameter)

**Only switch to instance method if:**
- You need to use `hasFeature(userId, featureKey)` method
- You want a singleton instance
- You prefer constructor injection over method injection

## Summary

| Method | Injection Needed? | Currently Used? |
|--------|------------------|----------------|
| `hasFeatureForRep` (static) | ❌ No | ✅ Yes (3 places) |
| `hasFeature` (instance) | ✅ Yes | ❌ No |

**Current Status:** Static method is used, no injection needed. If you want to use instance method, inject via DI file.


