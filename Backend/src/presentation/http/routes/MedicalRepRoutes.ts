import { Router } from "express";
import { upload } from "../../../infrastructure/storage/multer/MulterConfigFile";
import { medicalRepController } from "../../../infrastructure/di/MedicalRepDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { registerMedicalRepSchema } from "../validators/RepSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../domain/common/entities/IUser";

export class MedicalRepRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/signup",
      upload.single("companyLogoUrl"),
      ValidateSchema(registerMedicalRepSchema),
      medicalRepController.createMedicalRep
    );
    this.router.get(
      "/profile/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      medicalRepController.getRepProfileById
    );
  }
}
