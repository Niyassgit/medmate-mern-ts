import { Router } from "express";
import { guestController } from "../../../infrastructure/di/GuestDi";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { GuestRegisterSchema } from "../validators/GuestSchema";
import { Authenticate } from "../middlewares/Authenticate";
import { AuthorizeRole } from "../middlewares/AuthorizeRole";
import { Role } from "@prisma/client";
import { makeValidateUserMiddleware } from "../middlewares/ValidateUserMiddleware";
import { UserValidate } from "../../../infrastructure/di/UserValidateDI";
import { AddressSchema } from "../validators/CreateAddressSchema";

const validateUser = makeValidateUserMiddleware(UserValidate);
export class GuestRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/signup",
      ValidateSchema(GuestRegisterSchema),
      guestController.createGuest
    );
    this.router.use(Authenticate, AuthorizeRole([Role.GUEST]), validateUser);
    this.router.post(
      "/signup/:shareToken",
      ValidateSchema(GuestRegisterSchema),
      guestController.createGuest
    );

    this.router.get("/prescriptions", guestController.getPrescriptions);
    this.router.get("/address", guestController.getAllAddress);
    this.router.post(
      "/address",
      ValidateSchema(AddressSchema),
      guestController.createAddress
    );
    this.router.delete("/address/:addressId", guestController.deleteAddress);
    this.router.post(
      "/payment",
      guestController.makePayment
    );
  }
}
