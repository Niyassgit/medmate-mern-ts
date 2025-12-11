import { CreateGuestUseCase } from "../../application/Guest/auth/CreateGuestUseCase";
import { GetAllPrescriptionsUseCase } from "../../application/Guest/use-cases/GetAllPrescriptionsUaseCase";
import { GuestController } from "../../presentation/http/controllers/GuestController";
import { GuestRepository } from "../repositories/GuestRepository";
import { PrescriptionRepository } from "../repositories/PrescriptionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { BcryptServices } from "../services/BcryptService";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";
import { s3StorageService } from "../services/S3StorageService";

const userRepository = new UserRepository();
const guestRepository = new GuestRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const storageService = new s3StorageService();
const notificationService = new NotificationService();
const prescriptionRepository = new PrescriptionRepository();

const createGuestUseCase = new CreateGuestUseCase(
  userRepository,
  guestRepository,
  bcryptServices,
  otpService,
  notificationService,
  prescriptionRepository
);

const getAllPrescriptionsUseCase = new GetAllPrescriptionsUseCase(
  guestRepository,
  prescriptionRepository,
  storageService
);

export const guestController = new GuestController(
  createGuestUseCase,
  getAllPrescriptionsUseCase
);
