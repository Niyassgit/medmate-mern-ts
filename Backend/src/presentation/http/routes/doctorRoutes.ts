import { Router } from "express";
import { doctorController } from "../../../infrastructure/di/DoctorDI";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { upload } from "../../../infrastructure/storage/multer/MulterFactory";
import { DoctorRegisterSchema } from "../validators/DoctorRegisterSchemaValidator";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "../../../shared/Enums";
import { DoctorProfileUpdateSchema } from "../validators/DoctorProfileUpdateSchema";
import { uploadS3 } from "../../../infrastructure/storage/multer/MulterS3BucketConfig";
import { makeValidateUserMiddleware } from "../middlewares/ValidateUserMiddleware";
import { UserValidate } from "../../../infrastructure/di/UserValidateDI";
import { SendMessageSchema } from "../validators/MessageSchema";

const validateUser = makeValidateUserMiddleware(UserValidate);

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
    this.router.use(Authenticate, AuthorizeRole([Role.DOCTOR]), validateUser);
    this.router.get("/profile/:userId", doctorController.getDoctorprofileById);
    this.router.post(
      "/profile-image/:userId",
      uploadS3.single("profileImage"),
      doctorController.updateProfileImage
    );
    this.router.post(
      "/profile/complete/:userId",
      ValidateSchema(DoctorProfileUpdateSchema),
      doctorController.completeProfile
    );
    this.router.get("/networks/:userId", doctorController.networks);
    this.router.post("/connect/:repId", doctorController.connectionRequest);
    this.router.post(
      "/connections/accept/:repId",
      doctorController.acceptConnection
    );
    this.router.get("/analytics/:userId", doctorController.analytics);
    this.router.get("/feed/:userId", doctorController.getFeed);
    this.router.get("/feed/post-details/:postId", doctorController.postDetails);
    this.router.get("/rep/details/:repId", doctorController.RepDetails);
    this.router.post("/feed/:postId/like/toggle", doctorController.toggleLike);
    this.router.post(
      "/feed/:postId/interest/toggle",
      doctorController.toggleInterest
    );
    this.router.get(
      "/analytics/mutual-connections/:userId",
      doctorController.mutualConnections
    );
    this.router.get(
      "/analytics/pending-connections/:userId",
      doctorController.pendingConnections
    );
    this.router.get("/notifications/:userId", doctorController.notifications);
    this.router.post(
      "/notifications/connection/:notificationId/accept/:repId",
      doctorController.acceptConnectionOnNot
    );
    this.router.patch(
      "/notifications/mark-as-read/:notificationId",
      doctorController.markAsReadNotification
    );
    this.router.patch(
      "/notifications/mark-all-read/:userId",
      doctorController.markAllAsReadNotification
    );
    this.router.get(
      "/notifications/unread-count/:userId",
      doctorController.notificationUnreadCount
    );
    this.router.get("/chat/conversations", doctorController.getConversations);
    this.router.get(
      "/chat/messages/:conversationId",
      doctorController.getMessages
    );
    this.router.post(
      "/chat/message",
      ValidateSchema(SendMessageSchema),
      doctorController.createMessage
    );
    // this.router.patch("/chat/message/read/:conversationId",doctorController);
  }
}
