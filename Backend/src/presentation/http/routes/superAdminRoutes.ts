import { Router } from "express";
import { superAdminController } from "../../../infrastructure/di/SuperAdminDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { SuperAdminRegisterSchema } from "../validators/SuperAdminSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";

export class superAdminRoutes {
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
    this.router.get("/reps", superAdminController.getAllReps);
    this.router.get("/doctors", superAdminController.getAllDoctors);
    this.router.patch("/block/:userId", superAdminController.blockUser);
    this.router.patch("/unblock/:userId", superAdminController.unBlockUser);
    this.router.get(
      "/:id",
      Authenticate,
      AuthorizeRole(["SUPER_ADMIN"]),
      superAdminController.getSuperAdminByEmial
    );
  }
}
