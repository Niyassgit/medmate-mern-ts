import { CreatePatientUseCase } from "../../application/Patient/auth/CreatePatientUseCase";
import { PatientController } from "../../presentation/http/controllers/PatientController";
import { PatientRepository } from "../repositories/PatientRepository";
import { UserRepository } from "../repositories/UserRepository";
import { BcryptServices } from "../services/BcryptService";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";

const userRepository = new UserRepository();
const patientRepository = new PatientRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const notificationService = new NotificationService();

const createPatientUseCase = new CreatePatientUseCase(
  userRepository,
  patientRepository,
  bcryptServices,
  otpService,
  notificationService
);

export const patientController = new PatientController(createPatientUseCase);
