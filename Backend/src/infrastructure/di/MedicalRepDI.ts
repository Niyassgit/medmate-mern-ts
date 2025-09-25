import { MedicalRepController } from "../../presentation/http/controllers/MedicalRepController";
import { BcryptServices } from "../services/BcryptService";
import { CreateMedicalRepUseCase } from "../../application/medicalRep/auth/CreateMedicalRepUseCase";
import { GetRepProfileByIdUseCase } from "../../application/medicalRep/use-cases/GetRepProfileByIdUseCase";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { UserRepository } from "../repositories/UserRepository";
import { OtpService } from "../services/OtpService";
import { NotificationService } from "../services/NotificationService";

const medicalRepRepository = new MedicalRepRepository();
const userLoginRepository = new UserRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const notificationService = new NotificationService();

const createMedicalRepUseCase = new CreateMedicalRepUseCase(
  medicalRepRepository,
  bcryptServices,
  userLoginRepository,
  otpService,
  notificationService
);

const getRepProfileByIdUseCase=new GetRepProfileByIdUseCase(medicalRepRepository);

export const medicalRepController = new MedicalRepController(
  createMedicalRepUseCase,
  getRepProfileByIdUseCase
);
