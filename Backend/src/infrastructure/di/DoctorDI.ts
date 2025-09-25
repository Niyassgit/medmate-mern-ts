import { DoctorRepository } from "../repositories/DoctorRepository";
import { BcryptServices } from "../services/BcryptService";
import { CreateDoctorUseCase } from "../../application/doctor/auth/CreateDoctorUseCase";
import { DoctorController } from "../../presentation/http/controllers/DoctorController";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";
import { GetDoctorProfileByIdUseCase } from "../../application/doctor/use-cases/GetDoctorProfleByIdUseCase";

const doctorRepository = new DoctorRepository();
const bycryptServices = new BcryptServices();
const userLoginRepository = new UserRepository();
const otpService = new OtpService();
const notificationService = new NotificationService();

const createDoctorUseCase = new CreateDoctorUseCase(
  doctorRepository,
  bycryptServices,
  userLoginRepository,
  otpService,
  notificationService
);
const getDoctorprofileById=new GetDoctorProfileByIdUseCase(doctorRepository);



export const doctorController = new DoctorController(
  createDoctorUseCase,
  getDoctorprofileById
);
