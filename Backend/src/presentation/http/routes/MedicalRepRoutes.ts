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

    this.router.use(
      Authenticate,
      AuthorizeRole([Role.MEDICAL_REP]),
      validateUser
    );
    this.router.get("/profile/:userId", medicalRepController.getRepProfileById);
    this.router.post(
      "/profile-image/:userId",
      uploadS3.single("profileImage"),
      medicalRepController.updateProfileImage
    );
    this.router.post(
      "/profile/complete/:userId",
      upload.single("companyLogoUrl"),
      parseArrayFields,
      ValidateSchema(MedicalRepProfileUpdateSchema),
      medicalRepController.completeProfile
    );
    this.router.post(
      "/add-post/:userId",
      uploadS3.array("images", 5),
      parsePostField,
      ValidateSchema(productPostValidateSchema),
      medicalRepController.createPost
    );
    this.router.get("/posts/:userId", medicalRepController.posts);
    this.router.get("/post-details/:postId", medicalRepController.postDetails);
    this.router.post(
      "/post-edit/:postId",
      validateUser,
      uploadS3.array("images", 5),
      parsePostField,
      ValidateSchema(productPostValidateSchema),
      medicalRepController.editPost
    );
    this.router.patch(
      "/post/archive/:postId",
      medicalRepController.archivePost
    );
    this.router.delete("/post/delete/:postId", medicalRepController.deletePost);
    this.router.get("/networks/:userId", medicalRepController.networks);
    this.router.post(
      "/connect/:doctorId",
      medicalRepController.connectionRequest
    );
    this.router.post(
      "/connection/accept/:doctorId",
      medicalRepController.acceptingConnectionRequest
    );
    this.router.get("/analytics/:userId", medicalRepController.analytics);
    this.router.get(
      "/doctor/details/:doctorId",
      medicalRepController.doctorDetails
    );
  }
}
