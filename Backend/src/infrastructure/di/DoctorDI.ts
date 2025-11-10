import { DoctorRepository } from "../repositories/DoctorRepository";
import { BcryptServices } from "../services/BcryptService";
import { CreateDoctorUseCase } from "../../application/doctor/auth/CreateDoctorUseCase";
import { DoctorController } from "../../presentation/http/controllers/DoctorController";
import { UserRepository } from "../repositories/UserRepository";
import { NotificationService } from "../services/NotificationService";
import { OtpService } from "../services/OtpService";
import { GetDoctorProfileByIdUseCase } from "../../application/doctor/use-cases/GetDoctorProfleByIdUseCase";
import { ProfileImageUpdateUseCase } from "../../application/doctor/use-cases/ProfileImageUpdateUseCase";
import { CompleteProfileUseCase } from "../../application/doctor/use-cases/CompleteProfileUseCase";
import { s3StorageService } from "../services/S3StorageService";
import { NetworksUseCase } from "../../application/doctor/use-cases/NetworksUseCase";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { ConnectionRequestUseCase } from "../../application/doctor/use-cases/ConnectionRequestUseCase";
import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { AcceptConnectionRequestUseCase } from "../../application/doctor/use-cases/AcceptConnectionRequestUseCase";
import { DoctorAnalyticsUseCase } from "../../application/doctor/use-cases/DoctorAnalyticsUseCase";
import { DepartmentRepository } from "../repositories/DepatmentRepository";
import { GetFeedUseCase } from "../../application/doctor/use-cases/GetFeedUseCase";
import { ProductPostRepository } from "../repositories/ProductPostRepository";
import { PostDetailsUseCase } from "../../application/doctor/use-cases/PostDetailsUseCase";
import { GetRepDetailsOnDoctorUseCase } from "../../application/doctor/use-cases/GetRepDetailsOnDoctorUseCase";
import { ToggleLikeOnPostUseCase } from "../../application/Like/use-cases/ToggleLikeOnPostUseCase";
import { LikeRepository } from "../repositories/LikeRepository";
import { SocketEngagementEventPublisher } from "../realtime/publishers/SocketEngagementEventPublisher";
import { InterestRepository } from "../repositories/InterestRepostory";
import { ToggleInterestOnPostUseCase } from "../../application/interest/use-cases/ToggleInterestOnPostUseCase";

const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();
const bycryptServices = new BcryptServices();
const userRepository = new UserRepository();
const otpService = new OtpService();
const notificationService = new NotificationService();
const storageService = new s3StorageService();
const connectionRepository = new ConnectionRepository();
const departmentRepository = new DepartmentRepository();
const productPostRepository = new ProductPostRepository();
const likeRepository = new LikeRepository();
const interestRepository = new InterestRepository();
const eventPublisher = new SocketEngagementEventPublisher();
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
  storageService,
  connectionRepository
);
const connectionRequestUseCase = new ConnectionRequestUseCase(
  doctorRepository,
  medicalRepRepository,
  connectionRepository
);
const acceptConnectionRequestUseCase = new AcceptConnectionRequestUseCase(
  medicalRepRepository,
  doctorRepository,
  connectionRepository
);
const analyticsUsecase = new DoctorAnalyticsUseCase(
  doctorRepository,
  connectionRepository,
  departmentRepository,
  storageService
);
const getFeedUseCase = new GetFeedUseCase(
  doctorRepository,
  connectionRepository,
  productPostRepository,
  likeRepository,
  interestRepository,
  storageService
);
const postDetailsUseCase = new PostDetailsUseCase(
  doctorRepository,
  productPostRepository,
  connectionRepository,
  storageService
);
const getRepDetailsOnDoctorUseCase = new GetRepDetailsOnDoctorUseCase(
  userRepository,
  medicalRepRepository,
  productPostRepository,
  storageService
);
const toggleLikeOnPostUseCase = new ToggleLikeOnPostUseCase(
  doctorRepository,
  likeRepository,
  eventPublisher
);
const toggleInterestOnPostUseCase = new ToggleInterestOnPostUseCase(
  doctorRepository,
  interestRepository,
  eventPublisher

);
export const doctorController = new DoctorController(
  createDoctorUseCase,
  getDoctorprofileById,
  profileImageUpdateUseCase,
  completeProfileUseCase,
  networkUseCase,
  connectionRequestUseCase,
  acceptConnectionRequestUseCase,
  analyticsUsecase,
  getFeedUseCase,
  postDetailsUseCase,
  getRepDetailsOnDoctorUseCase,
  toggleLikeOnPostUseCase,
  toggleInterestOnPostUseCase
);
