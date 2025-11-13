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
    this.router.use(Authenticate,AuthorizeRole([Role.SUPER_ADMIN]));
    this.router.get(
      "/reps",
      superAdminController.getAllReps
    );
    this.router.get(
      "/doctors",
      superAdminController.getAllDoctors
    );
    this.router.patch(
      "/block/:userId",
      superAdminController.blockUser
    );
    this.router.patch(
      "/unblock/:userId",
      superAdminController.unBlockUser
    );
    this.router.get(
      "/:id",
      superAdminController.getSuperAdminByEmail
    );
    this.router.get(
      "/doctors/:userId",
      superAdminController.doctorDetails
    );
    this.router.get(
      "/reps/:userId",
      superAdminController.repDetails
    );
    this.router.get(
      "/territories/:userId",
      superAdminController.territories
    );
    this.router.post(
      "/territories/add/:userId",
      ValidateSchema(TeritorySchema),
      superAdminController.addTerritory
    );
    this.router.patch(
      "/territories/edit/:territoryId",
      ValidateSchema(TeritorySchema),
      superAdminController.editTerritory
    );
    this.router.post(
      "/departments/add/:userId",
      ValidateSchema(DepartmentSchema),
      superAdminController.createDepartment
    );
    this.router.get(
      "/departments/:userId",
      superAdminController.departments
    );
    this.router.patch(
      "/departments/edit/:departmentId",
      ValidateSchema(DepartmentSchema),
      superAdminController.editDepartment
    );
  }
}
