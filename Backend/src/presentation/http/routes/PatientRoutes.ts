import { Router } from "express";
import { patientController } from "../../../infrastructure/di/PatientDi";
import { ValidateSchema } from "../middlewares/ValidateSchema";
import { PatientRegisterSchema } from "../validators/PatientSchema";

export class PatientRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/signup",
      ValidateSchema(PatientRegisterSchema),
      patientController.createPatient
    );
  }
}
