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
import { ProductPostPresentationService } from "../../application/common/services/ProductPostPresentationService";
import { GetNetworksUseCase } from "../../application/medicalRep/use-cases/GetNetworksUseCase";
import { DoctorRepository } from "../repositories/DoctorRepository";
import { RepMakeConnectionRequestUseCase } from "../../application/connection/use-cases/RepMakeConnectionRequestUseCase";
import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { RepAcceptingConnectionRequest } from "../../application/connection/use-cases/RepAcceptConnectionRequestUseCase";
import { GetRepAnalyticsUseCase } from "../../application/medicalRep/use-cases/GetRepAnalyticsUseCase";
import { DepartmentRepository } from "../repositories/DepatmentRepository";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { ArchivePostUseCase } from "../../application/productPost/use-case/ArchivePostUseCase";
import { DeletePostUseCase } from "../../application/productPost/use-case/DeletePostUseCase";
import { GetDoctorDetailsOnRepSideUseCase } from "../../application/medicalRep/use-cases/GetDoctorDetailsOnRepSideUseCase";
import { RepMutualConnectionsUseCase } from "../../application/medicalRep/use-cases/RepMutualConnectionsUseCase";
import { RepPendingConnectionsUseCase } from "../../application/medicalRep/use-cases/RepPendingConnectionsUseCase";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { GetRepNotificationsUseCase } from "../../application/notification/use-cases/GetRepNotificationsUseCase";
import { RepRejectConnectionUseCase } from "../../application/connection/use-cases/RepRejectConnectionUseCase";

const medicalRepRepository = new MedicalRepRepository();
const doctorRepository = new DoctorRepository();
const userRepository = new UserRepository();
const bcryptServices = new BcryptServices();
const otpService = new OtpService();
const notificationService = new NotificationService();
const productPostRepository = new ProductPostRepository();
const storageService = new s3StorageService();
const productPostPresentationService = new ProductPostPresentationService(
  storageService
);
const connectionRepository = new ConnectionRepository();
const departmentRepository = new DepartmentRepository();
const territoryRepository = new TerritoryRepository();
const notificationRepository = new NotificationRepository();
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
  productPostPresentationService
);

const getProductPostDetailsUseCase = new GetProductPostDetailsUseCase(
  productPostRepository,
  storageService
);
const getNetworksUseCase = new GetNetworksUseCase(
  userRepository,
  doctorRepository,
  medicalRepRepository,
  storageService,
  connectionRepository
);
const makeConnectionRequestUseCase = new RepMakeConnectionRequestUseCase(
  medicalRepRepository,
  doctorRepository,
  connectionRepository,
  notificationRepository
);
const acceptConnectionRequestUseCase = new RepAcceptingConnectionRequest(
  medicalRepRepository,
  doctorRepository,
  connectionRepository,
  notificationRepository
);
const getRepAnalyticsUseCase = new GetRepAnalyticsUseCase(
  medicalRepRepository,
  connectionRepository,
  departmentRepository,
  territoryRepository,
  storageService
);
const archivePostUseCase = new ArchivePostUseCase(
  userRepository,
  productPostRepository
);
const deletePostUseCase = new DeletePostUseCase(
  userRepository,
  productPostRepository
);
const doctorDetailsOnRepSideUseCase = new GetDoctorDetailsOnRepSideUseCase(
  medicalRepRepository,
  doctorRepository,
  storageService,
  connectionRepository
);

const mutualConnectionsUseCase = new RepMutualConnectionsUseCase(
  medicalRepRepository,
  connectionRepository,
  storageService
);

const pendingConnectionsUseCase = new RepPendingConnectionsUseCase(
  medicalRepRepository,
  connectionRepository,
  storageService
);

const getAllNotificationsUseCase = new GetRepNotificationsUseCase(
  medicalRepRepository,
  notificationRepository,
  storageService,
  connectionRepository
);

const rejectConnectionUseCase = new RepRejectConnectionUseCase(
  medicalRepRepository,
  connectionRepository,
  notificationRepository
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
  getNetworksUseCase,
  makeConnectionRequestUseCase,
  acceptConnectionRequestUseCase,
  getRepAnalyticsUseCase,
  archivePostUseCase,
  deletePostUseCase,
  doctorDetailsOnRepSideUseCase,
  mutualConnectionsUseCase,
  pendingConnectionsUseCase,
  getAllNotificationsUseCase,
  rejectConnectionUseCase
);
