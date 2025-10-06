import { Router } from "express";
import { upload } from "../../../infrastructure/storage/multer/MulterConfigFile";
import { medicalRepController } from "../../../infrastructure/di/MedicalRepDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { registerMedicalRepSchema } from "../validators/RepSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../domain/common/entities/IUser";
import { uploadCloud } from "../../../infrastructure/storage/multer/MulterConfigCloudinary";
import { MedicalRepProfileUpdateSchema } from "../validators/MedicalRepProfileUpdateSchema";

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
    this.router.post(
      "/profile-image/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      uploadCloud.single("profileImage"),
      medicalRepController.updateProfileImage
    );
    this.router.post(
      "/profile/complete/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      ValidateSchema(MedicalRepProfileUpdateSchema),
      medicalRepController.completeProfile
    );
    this.router.post(
      "/profile/complete/upload-logo/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      upload.single("companyLogoUrl"),
      medicalRepController.updateCompanyLogo
    );
    this.router.post(
      "/add-post/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      uploadCloud.array("images",5),
      medicalRepController.createPost
    );
    // this.router.post("/edit-post/:userId",Authenticate,AuthorizeRole([Role.MEDICAL_REP]),uploadCloud.array("images",5),medicalRepController)
  }

}
