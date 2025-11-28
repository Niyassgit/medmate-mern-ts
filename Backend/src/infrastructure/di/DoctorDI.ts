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
import { DoctorConnectionRequestUseCase } from "../../application/connection/use-cases/DoctorConnectionRequestUseCase";
import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { RepAcceptingConnectionRequest } from "../../application/connection/use-cases/RepAcceptConnectionRequestUseCase";
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
import { DoctorMutualConnectionsUseCase } from "../../application/doctor/use-cases/DoctorMutualConnectionsUseCase";
import { DoctorPendingConnectionsUseCase } from "../../application/doctor/interfaces/DoctorPendingConectionsUseCase";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { GetDoctorNotificationsUseCase } from "../../application/notification/use-cases/GetDoctorNotificationsUseCase";
import { DoctorRejectConnectionUseCase } from "../../application/connection/use-cases/DoctorRejectConnectionUseCase";
import { DoctorAcceptOnNotUseCase } from "../../application/connection/use-cases/DoctorAcceptOnNotUseCase";
import { NotificationEventPublisher } from "../realtime/publishers/NotificationEventPublisher";
import { MakeAllAsReadNotificationUseCase } from "../../application/notification/use-cases/MarkAllAsReadNotificationUseCase";
import { MarkNotificationAsReadUseCase } from "../../application/notification/use-cases/MarkNotificationAsReadUseCase";
import { NotificationUnreadCountUseCase } from "../../application/notification/use-cases/NotificationUnreadCountUseCase";
import { ConversationRepository } from "../repositories/ConversationRepository";
import { GetUserConversationsUseCase } from "../../application/conversation/use-case/GetUserConversationsUseCase";
import { DoctorAcceptConnectionRequestUseCase } from "../../application/connection/use-cases/DoctorAcceptConnectionRequestUseCase";
import { GetAllMessagesUseCase } from "../../application/conversation/use-case/GetAllMessagesUseCase";
import { MessageRepository } from "../repositories/MessageRepository";
import { CreateDoctorMessageUseCase } from "../../application/conversation/use-case/CreateDoctorMessageUseCase";
import { ChatEventPublisher } from "../realtime/publishers/ChatEventPublisher";
import { DoctoMessageMarkAsReadUseCase } from "../../application/conversation/use-case/DoctorMessageMarkAsReadUseCase";

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
const notificationRepository = new NotificationRepository();
const notificationEventPublisher = new NotificationEventPublisher();
const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const chatEventPublisher = new ChatEventPublisher();

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
const connectionRequestUseCase = new DoctorConnectionRequestUseCase(
  doctorRepository,
  medicalRepRepository,
  connectionRepository,
  notificationRepository,
  notificationEventPublisher,
  storageService
);
const acceptConnectionRequestUseCase = new DoctorAcceptConnectionRequestUseCase(
  medicalRepRepository,
  doctorRepository,
  connectionRepository,
  notificationRepository,
  conversationRepository
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
  medicalRepRepository,
  likeRepository,
  eventPublisher,
  notificationRepository,
  productPostRepository,
  notificationEventPublisher,
  storageService
);
const toggleInterestOnPostUseCase = new ToggleInterestOnPostUseCase(
  doctorRepository,
  medicalRepRepository,
  interestRepository,
  eventPublisher,
  notificationRepository,
  productPostRepository,
  notificationEventPublisher,
  storageService
);

const mutualConnectionsUseCase = new DoctorMutualConnectionsUseCase(
  doctorRepository,
  connectionRepository,
  storageService
);

const pendingConnectionsUseCase = new DoctorPendingConnectionsUseCase(
  doctorRepository,
  connectionRepository,
  storageService
);
const getDoctorNotificationsUseCase = new GetDoctorNotificationsUseCase(
  doctorRepository,
  notificationRepository,
  storageService
);
const rejectConnectionUseCase = new DoctorRejectConnectionUseCase(
  doctorRepository,
  connectionRepository,
  notificationRepository
);

const acceptConnOnNotificationPage = new DoctorAcceptOnNotUseCase(
  doctorRepository,
  notificationRepository,
  connectionRepository,
  conversationRepository
);

const markAllNotificationAsReadedUseCase = new MakeAllAsReadNotificationUseCase(
  notificationRepository
);

const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(
  notificationRepository
);

const getUnreadNotificationCountUseCase = new NotificationUnreadCountUseCase(
  notificationRepository
);

const getUserConversationsUseCase = new GetUserConversationsUseCase(
  conversationRepository,
  storageService,
  medicalRepRepository,
  doctorRepository
);

const getAllMessagesUseCase = new GetAllMessagesUseCase(messageRepository);

const createMessageUseCase = new CreateDoctorMessageUseCase(
  doctorRepository,
  messageRepository,
  chatEventPublisher
);

const markMessageAsReadUseCase = new DoctoMessageMarkAsReadUseCase(
  doctorRepository,
  messageRepository,
  conversationRepository
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
  toggleInterestOnPostUseCase,
  mutualConnectionsUseCase,
  pendingConnectionsUseCase,
  getDoctorNotificationsUseCase,
  rejectConnectionUseCase,
  acceptConnOnNotificationPage,
  markAllNotificationAsReadedUseCase,
  markNotificationAsReadUseCase,
  getUnreadNotificationCountUseCase,
  getUserConversationsUseCase,
  getAllMessagesUseCase,
  createMessageUseCase,
  markMessageAsReadUseCase
);
