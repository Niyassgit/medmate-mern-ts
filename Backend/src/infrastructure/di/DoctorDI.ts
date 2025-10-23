import { DoctorRepository } from "../repositories/DoctorRepository";
import { BcryptServices } from "../services/BcryptService";
import { CreateDoctorUseCase } from "../../application/doctor/auth/CreateDoctorUseCase";
import { DoctorController } from "../../presentation/http/controllers/DoctorController";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";
import { GetDoctorProfileByIdUseCase } from "../../application/doctor/use-cases/GetDoctorProfleByIdUseCase";
import { ProfileImageUpdateUseCase } from "../../application/doctor/use-cases/ProfileImageUpdateUseCase";
import { CloudinaryService } from "../services/CloudinaryService";
import { CompleteProfileUseCase } from "../../application/doctor/use-cases/CompleteProfileUseCase";
import { s3StorageService } from "../services/S3StorageService";
import { NetworksUseCase } from "../../application/doctor/use-cases/NetworksUseCase";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";

const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();
const bycryptServices = new BcryptServices();
const userRepository = new UserRepository();
const otpService = new OtpService();
const notificationService = new NotificationService();
const storageService = new s3StorageService();

const createDoctorUseCase = new CreateDoctorUseCase(
  doctorRepository,
  bycryptServices,
  userRepository,
  otpService,
  notificationService
);
const getDoctorprofileById = new GetDoctorProfileByIdUseCase(
  doctorRepository,
  userRepository,
  storageService
);
const profileImageUpdateUseCase = new ProfileImageUpdateUseCase(
  userRepository,
  storageService
);
const completeProfileUseCase = new CompleteProfileUseCase(
  userRepository,
  doctorRepository
);
const networkUseCase = new NetworksUseCase(
  userRepository,
  doctorRepository,
  medicalRepRepository,
  storageService
);

export const doctorController = new DoctorController(
  createDoctorUseCase,
  getDoctorprofileById,
  profileImageUpdateUseCase,
  completeProfileUseCase,
  networkUseCase
);
