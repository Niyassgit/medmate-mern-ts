import { Router } from "express";
import { upload } from "../../../infrastructure/storage/multer/MulterFactory";
import { medicalRepController } from "../../../infrastructure/di/MedicalRepDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { registerMedicalRepSchema } from "../validators/RepSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../shared/Enums";
import { MedicalRepProfileUpdateSchema } from "../validators/MedicalRepProfileUpdateSchema";
import { parseArrayFields } from "../middlewares/ParseArrayField";
import { productPostValidateSchema } from "../validators/ProductPostValidateSchema";
import { parsePostField } from "../middlewares/ParsePostField";
import { UserValidate } from "../../../infrastructure/di/UserValidateDI";
import { makeValidateUserMiddleware } from "../middlewares/ValidateUserMiddleware";
import { uploadS3 } from "../../../infrastructure/storage/multer/MulterS3BucketConfig";

const validateUser = makeValidateUserMiddleware(UserValidate);

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
      parsePostField,
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
      uploadS3.single("profileImage"),
      medicalRepController.updateProfileImage
    );
    this.router.post(
      "/profile/complete/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      upload.single("companyLogoUrl"),
      parseArrayFields,
      ValidateSchema(MedicalRepProfileUpdateSchema),
      medicalRepController.completeProfile
    );
    this.router.post(
      "/add-post/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      uploadS3.array("images", 5),
      parsePostField,
      ValidateSchema(productPostValidateSchema),
      medicalRepController.createPost
    );
    this.router.get(
      "/posts/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      medicalRepController.posts
    );
    this.router.get(
      "/post-details/:postId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      validateUser,
      medicalRepController.postDetails
    );
    this.router.post(
      "/post-edit/:postId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      validateUser,
      uploadS3.array("images", 5),
      parsePostField,
      ValidateSchema(productPostValidateSchema),
      medicalRepController.editPost
    );
    this.router.get(
      "/networks/:userId",
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      medicalRepController.networks
    );
  }
}
