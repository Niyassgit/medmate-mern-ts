import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { SuperAdminRegisterSchema } from "../validators/SuperAdminRegisterSchema";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../shared/Enums";
import { TeritorySchema } from "../validators/TerritoryValidateSchema";
import { DepartmentSchema } from "../validators/DepartmentShema";
import { subscriptionPlanSchema } from "../validators/SubscriptionPlanSchema";

export class SuperAdminRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      "/signup",
      ValidateSchema(SuperAdminRegisterSchema),
      superAdminController.createSuperAdmin
    );
    this.router.use(Authenticate, AuthorizeRole([Role.SUPER_ADMIN]));
    this.router.get("/reps", superAdminController.getAllReps);
    this.router.get("/doctors", superAdminController.getAllDoctors);
    this.router.patch("/block/:userId", superAdminController.blockUser);
    this.router.patch("/unblock/:userId", superAdminController.unBlockUser);
    this.router.get("/doctors/:userId", superAdminController.doctorDetails);
    this.router.get("/reps/:userId", superAdminController.repDetails);
    this.router.get("/territories/:userId", superAdminController.territories);
    this.router.post(
      "/territories/create",
      ValidateSchema(TeritorySchema),
      superAdminController.addTerritory
    );
    this.router.patch(
      "/territories/edit/:territoryId",
      ValidateSchema(TeritorySchema),
      superAdminController.editTerritory
    );
    this.router.post(
      "/departments/create",
      ValidateSchema(DepartmentSchema),
      superAdminController.createDepartment
    );
    this.router.get("/departments/:userId", superAdminController.departments);
    this.router.patch(
      "/departments/edit/:departmentId",
      ValidateSchema(DepartmentSchema),
      superAdminController.editDepartment
    );
    this.router.get(
      "/subscriptions",
      superAdminController.getAllSubscriptionPlan
    );
    this.router.post(
      "/subscriptions/create",
      ValidateSchema(subscriptionPlanSchema),
      superAdminController.createSubscriptionPlan
    );
    this.router.patch(
      "/subscription/update/:subscriptionId",
      ValidateSchema(subscriptionPlanSchema),
      superAdminController.subscriptionUpdate
    );
    this.router.patch(
      "/subscription/toggle/:subscriptionId",
      superAdminController.subscriptionListToggle
    );
    this.router.delete(
      "/subscription/delete/:subscriptionId",
      superAdminController.deleteSubscriptionPlan
    );
    this.router.get("/stats/summary", superAdminController.getStatsSummary);
    this.router.get(
      "/stats/user-distribution",
      superAdminController.userDistribution
    );
    this.router.get("/stats/user-growth", superAdminController.userGrowth);
    this.router.get(
      "/stats/revenue-by-tier",
      superAdminController.revenueByTier
    );
    this.router.get(
      "/subscriptions/recent",
      superAdminController.recentSubscriptions
    );
    this.router.get("/subscibed/list", superAdminController.subscribedList);
    this.router.get("/guests", superAdminController.getAllGuests);
    this.router.get("/order-analytics", superAdminController.orderAnalytics);
    this.router.get(
      "/stats/doctor-earnings",
      superAdminController.doctorEarnings
    );
    this.router.get(
      "/stats/admin-earnings",
      superAdminController.adminEarnings
    );

    this.router.get("/orders", superAdminController.getAllOrders);

    this.router.get(
      "/territory/:territoryId",
      superAdminController.territoryDetails
    );
    this.router.get("/:id", superAdminController.getSuperAdminByEmail);
  }
}
