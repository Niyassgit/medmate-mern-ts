import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { SuperAdminRegisterSchema } from "../validators/SuperAdminRegisterSchema";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../shared/Enums";
import { TeritorySchema } from "../validators/TerritoryValidateSchema";
import { DepartmentSchema } from "../validators/DepartmentShema";

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
    this.router.get(
      "/reps",
      Authenticate,
      AuthorizeRole(["SUPER_ADMIN"]),
      superAdminController.getAllReps
    );
    this.router.get(
      "/doctors",
      Authenticate,
      AuthorizeRole(["SUPER_ADMIN"]),
      superAdminController.getAllDoctors
    );
    this.router.patch(
      "/block/:userId",
      Authenticate,
      AuthorizeRole(["SUPER_ADMIN"]),
      superAdminController.blockUser
    );
    this.router.patch(
      "/unblock/:userId",
      Authenticate,
      AuthorizeRole(["SUPER_ADMIN"]),
      superAdminController.unBlockUser
    );
    this.router.get(
      "/:id",
      Authenticate,
      AuthorizeRole(["SUPER_ADMIN"]),
      superAdminController.getSuperAdminByEmail
    );
    this.router.get(
      "/doctors/:userId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      superAdminController.doctorDetails
    );
    this.router.get(
      "/reps/:userId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      superAdminController.repDetails
    );
    this.router.get(
      "/territories/:userId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      superAdminController.territories
    );
    this.router.post(
      "/territories/add/:userId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      ValidateSchema(TeritorySchema),
      superAdminController.addTerritory
    );
    this.router.patch(
      "/territories/edit/:territoryId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      ValidateSchema(TeritorySchema),
      superAdminController.editTerritory
    );
    this.router.post(
      "/departments/add/:userId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      ValidateSchema(DepartmentSchema),
      superAdminController.createDepartment
    );
    this.router.get(
      "/departments/:userId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      superAdminController.departments
    );
    this.router.patch(
      "/departments/edit/:departmentId",
      Authenticate,
      AuthorizeRole([Role.SUPER_ADMIN]),
      ValidateSchema(DepartmentSchema),
      superAdminController.editDepartment
    );
  }
}
