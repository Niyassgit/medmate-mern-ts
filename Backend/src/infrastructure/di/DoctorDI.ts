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

const doctorRepository = new DoctorRepository();
const bycryptServices = new BcryptServices();
const userRepository = new UserRepository();
const otpService = new OtpService();
const notificationService = new NotificationService();
const cloudinaryService=new CloudinaryService()

const createDoctorUseCase = new CreateDoctorUseCase(
  doctorRepository,
  bycryptServices,
  userRepository,
  otpService,
  notificationService
);
const getDoctorprofileById=new GetDoctorProfileByIdUseCase(doctorRepository);
const profileImageUpdateUseCase=new ProfileImageUpdateUseCase(cloudinaryService,userRepository,doctorRepository)


export const doctorController = new DoctorController(
  createDoctorUseCase,
  getDoctorprofileById,
  profileImageUpdateUseCase
);
