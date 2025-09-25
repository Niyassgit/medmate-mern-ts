import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { SuperAdminRegisterSchema } from "../validators/SuperAdminRegisterSchema";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../domain/common/entities/IUser";


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
      this.router.get("/doctors/:userId",Authenticate,AuthorizeRole([Role.SUPER_ADMIN]),superAdminController.doctorDetails);
      this.router.get("/reps/:userId",Authenticate,AuthorizeRole([Role.SUPER_ADMIN]),superAdminController.repDetails)
  }

}
