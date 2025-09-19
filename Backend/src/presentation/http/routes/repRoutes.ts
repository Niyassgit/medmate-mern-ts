import { Router } from "express";
import { medicalRepController } from "../../../infrastructure/di/MedicalRepDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { upload } from "../../../infrastructure/storage/multer/MulterConfig";
import { registerMedicalRepSchema } from "../validators/RepSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";

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
      "/:id",
      Authenticate,
      AuthorizeRole(["MEDICAL_REP"]),
      medicalRepController.getMedicalRepByProfileId
    );
  }
}
