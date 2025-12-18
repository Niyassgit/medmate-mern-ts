import { CreateGuestUseCase } from "../../application/Guest/auth/CreateGuestUseCase";
import { CreateAddressUseCase } from "../../application/Guest/use-cases/CreateAddressUseCase";
import { DeleteAddressUseCase } from "../../application/Guest/use-cases/DeleteAddressUseCase";
import { GetAllAddressUseCase } from "../../application/Guest/use-cases/GetAllAddressUseCase";
import { GetAllPrescriptionsUseCase } from "../../application/Guest/use-cases/GetAllPrescriptionsUaseCase";
import { GuestController } from "../../presentation/http/controllers/GuestController";
import { AddressRepository } from "../repositories/AddressRepository";
import { GuestRepository } from "../repositories/GuestRepository";
import { PrescriptionRepository } from "../repositories/PrescriptionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { BcryptServices } from "../services/BcryptService";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";
import { s3StorageService } from "../services/S3StorageService";

import { MakePaymentUseCase } from "../../application/Guest/use-cases/MakePaymentUseCase";
import { OrderRepository } from "../repositories/OrderRepository";
import { StripePaymentService } from "../services/StripePaymentService";
import { GetOrdersUseCase } from "../../application/Guest/use-cases/GetOrdersUseCase";
import { GetOrderDetailUseCase } from "../../application/Guest/use-cases/GetOrderDetailUseCase";
import { GetProfileDetailsUseCase } from "../../application/Guest/use-cases/GetProfileDetailsUseCase";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { CompleteGuestProfileUseCase } from "../../application/Guest/use-cases/CompleteGuestProfileUseCase";
import { ChangePasswordUseCase } from "../../application/common/use-cases/ChangePasswordUseCase";
import { DoctorRepository } from "../repositories/DoctorRepository";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { VerifyOldPasswordUseCase } from "../../application/common/use-cases/VerifyOldPasswordUseCase";

const userRepository = new UserRepository();
const guestRepository = new GuestRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const storageService = new s3StorageService();
const notificationService = new NotificationService();
const prescriptionRepository = new PrescriptionRepository();
const addressRepository = new AddressRepository();
const orderRepository = new OrderRepository();
const stripePaymentService = new StripePaymentService();
const territoryRepository = new TerritoryRepository();
const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();

const createGuestUseCase = new CreateGuestUseCase(
  userRepository,
  guestRepository,
  bcryptServices,
  otpService,
  notificationService,
  prescriptionRepository
);

const makePaymentUseCase = new MakePaymentUseCase(
  orderRepository,
  prescriptionRepository,
  stripePaymentService,
  guestRepository
);

const getAllPrescriptionsUseCase = new GetAllPrescriptionsUseCase(
  guestRepository,
  prescriptionRepository,
  storageService
);
const getAllAddressUseCase = new GetAllAddressUseCase(
  guestRepository,
  addressRepository
);
const createAddressUseCase = new CreateAddressUseCase(
  guestRepository,
  addressRepository
);

const deleteAddressUseCase = new DeleteAddressUseCase(
  guestRepository,
  addressRepository
);

const getOrdersUseCase = new GetOrdersUseCase(
  guestRepository,
  orderRepository,
  storageService
);

const getOrderDetailUseCase = new GetOrderDetailUseCase(
  orderRepository,
  guestRepository,
  storageService
);

const getProfileDetailsUseCase = new GetProfileDetailsUseCase(
  guestRepository,
  userRepository,
  territoryRepository,
  storageService
);

const completeGuestProfileUseCase = new CompleteGuestProfileUseCase(
  guestRepository,
  userRepository,
  territoryRepository
);

const changePasswordUseCase = new ChangePasswordUseCase(
  medicalRepRepository,
  doctorRepository,
  guestRepository,
  userRepository,
  bcryptServices
);

const verifyOldPasswordUseCase = new VerifyOldPasswordUseCase(
  userRepository,
  bcryptServices
);

export const guestController = new GuestController(
  createGuestUseCase,
  getAllPrescriptionsUseCase,
  getAllAddressUseCase,
  createAddressUseCase,
  deleteAddressUseCase,
  makePaymentUseCase,
  getOrdersUseCase,
  getOrderDetailUseCase,
  getProfileDetailsUseCase,
  completeGuestProfileUseCase,
  changePasswordUseCase,
  verifyOldPasswordUseCase
);
