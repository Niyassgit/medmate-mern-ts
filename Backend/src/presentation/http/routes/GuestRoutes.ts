import { Router } from "express";
import { guestController } from "../../../infrastructure/di/GuestDi";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { GuestRegisterSchema } from "../validators/GuestSchema";

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

    this.router.post(
      "/signup/:shareToken",
      ValidateSchema(GuestRegisterSchema),
      guestController.createGuest
    );

    this.router.get("/prescriptions", guestController.getPrescriptions);
  }
}
