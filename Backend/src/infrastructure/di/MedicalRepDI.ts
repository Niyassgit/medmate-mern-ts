import { MedicalRepController } from "../../presentation/http/controllers/MedicalRepController";
import { BcryptServices } from "../services/BcryptService";
import { CreateMedicalRepUseCase } from "../../application/medicalRep/auth/CreateMedicalRepUseCase";
import { GetRepProfileByIdUseCase } from "../../application/medicalRep/use-cases/GetRepProfileByIdUseCase";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { UserRepository } from "../repositories/UserRepository";
import { OtpService } from "../services/OtpService";
import { NotificationService } from "../services/NotificationService";
import { ProfileImageUpdateUseCase } from "../../application/medicalRep/use-cases/ProfileImageUpdateUseCase";
import { CompleteRepProfileUseCase } from "../../application/medicalRep/use-cases/CompleteRepProfileUseCase";
import { ProductPostRepository } from "../repositories/ProductPostRepository";
import { CreatePostUseCase } from "../../application/productPost/use-case/CreatePostUseCase";
import { EditProductPostUseCase } from "../../application/productPost/use-case/EditProductPostUseCase";
import { GetProductPostListUseCase } from "../../application/productPost/use-case/GetProductPostListUseCase";
import { GetProductPostDetailsUseCase } from "../../application/productPost/use-case/GetProductPostDetailsUseCase";
import { s3StorageService } from "../services/S3StorageService";

const medicalRepRepository = new MedicalRepRepository();
const userRepository = new UserRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const notificationService = new NotificationService();
const productPostRepository = new ProductPostRepository();
const storageService = new s3StorageService();

const createMedicalRepUseCase = new CreateMedicalRepUseCase(
  medicalRepRepository,
  bcryptServices,
  userRepository,
  otpService,
  notificationService
);

const getRepProfileByIdUseCase = new GetRepProfileByIdUseCase(
  medicalRepRepository,
  userRepository,
  storageService
);
const profileUpdateImageUseCase = new ProfileImageUpdateUseCase(
  userRepository,
  storageService
);
const completRepProfileUseCase = new CompleteRepProfileUseCase(
  userRepository,
  medicalRepRepository
);

const createPostUseCase = new CreatePostUseCase(
  userRepository,
  productPostRepository,
  medicalRepRepository
);
const editProductPostUseCase = new EditProductPostUseCase(
  productPostRepository,
  storageService
);
const getProductPostListUseCase = new GetProductPostListUseCase(
  userRepository,
  productPostRepository,
  medicalRepRepository,
  storageService
);

const getProductPostDetailsUseCase = new GetProductPostDetailsUseCase(
  productPostRepository,
  storageService
);

export const medicalRepController = new MedicalRepController(
  createMedicalRepUseCase,
  getRepProfileByIdUseCase,
  profileUpdateImageUseCase,
  completRepProfileUseCase,
  createPostUseCase,
  editProductPostUseCase,
  getProductPostListUseCase,
  getProductPostDetailsUseCase,
);
