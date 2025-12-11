import { CreateGuestUseCase } from "../../application/Guest/auth/CreateGuestUseCase";
import { GuestController } from "../../presentation/http/controllers/GuestController";
import { GuestRepository } from "../repositories/GuestRepository";
import { PrescriptionRepository } from "../repositories/PrescriptionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { BcryptServices } from "../services/BcryptService";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";

const userRepository = new UserRepository();
const guestRepository = new GuestRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const notificationService = new NotificationService();
const prescriptionRepository=new PrescriptionRepository();

const createGuestUseCase = new CreateGuestUseCase(
  userRepository,
  guestRepository,
  bcryptServices,
  otpService,
  notificationService,
  prescriptionRepository
);

export const guestController = new GuestController(createGuestUseCase);
