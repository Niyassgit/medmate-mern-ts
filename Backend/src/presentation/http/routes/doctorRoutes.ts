import { Router } from "express";
import { doctorController } from "../../../infrastructure/di/DoctorDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { upload } from "../../../infrastructure/storage/multer/MulterFactory";
import { DoctorRegisterSchema } from "../validators/DoctorRegisterSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../shared/enums"; 
import { uploadCloud } from "../../../infrastructure/storage/multer/MulterConfigCloudinary";
import { DoctorProfileUpdateSchema } from "../validators/DoctorProfileUpdateSchema";
import { uploadS3 } from "../../../infrastructure/storage/multer/MulterS3BucketConfig";

export class DoctorRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/signup",
      upload.single("licenseImageUrl"),
      ValidateSchema(DoctorRegisterSchema),
      doctorController.createDoctor
    );
    this.router.get(
      "/profile/:userId",
      Authenticate,
      AuthorizeRole([Role.DOCTOR]),
      doctorController.getDoctorprofileById
    );
    this.router.post(
      "/profile-image/:userId",
      Authenticate,
      AuthorizeRole([Role.DOCTOR]),
      uploadS3.single("profileImage"),
      doctorController.updateProfileImage
    );
    this.router.post(
      "/profile/complete/:userId",
      Authenticate,
      AuthorizeRole([Role.DOCTOR]),
      ValidateSchema(DoctorProfileUpdateSchema),
      doctorController.completeProfile
    );
  }
}
