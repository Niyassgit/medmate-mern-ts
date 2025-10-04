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
import { UpdateCompanyLogoUseCase} from "../../application/medicalRep/use-cases/UpdateCompanyLogoUseCase";

import { ProductPostRepository } from "../repositories/ProductPostRepository";
import { CreatePostUseCase } from "../../application/productPost/use-case/CreatePostUseCase";

const medicalRepRepository = new MedicalRepRepository();
const userRepository = new UserRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const notificationService = new NotificationService();
const productPostRepository=new ProductPostRepository();

const createMedicalRepUseCase = new CreateMedicalRepUseCase(
  medicalRepRepository,
  bcryptServices,
  userRepository,
  otpService,
  notificationService
);

const getRepProfileByIdUseCase=new GetRepProfileByIdUseCase(medicalRepRepository);
const profileUpdateImageUseCase=new ProfileImageUpdateUseCase(medicalRepRepository);
const completRepProfileUseCase=new CompleteRepProfileUseCase(userRepository,medicalRepRepository);
const uploadCompanyLogo=new UpdateCompanyLogoUseCase(medicalRepRepository);
const createPostUseCase=new CreatePostUseCase(medicalRepRepository,productPostRepository);

export const medicalRepController = new MedicalRepController(
  createMedicalRepUseCase,
  getRepProfileByIdUseCase,
  profileUpdateImageUseCase,
  completRepProfileUseCase,
  uploadCompanyLogo,
  createPostUseCase
);
