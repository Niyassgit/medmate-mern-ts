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
import { DoctorAcceptConnectionRequestUseCase } from "../../application/connection/use-cases/DoctorAcceptConnectionRequestUseCase";
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
import { RepAcceptConnOnNotUseCase } from "../../application/connection/use-cases/RepAcceptConnOnNotUseCase";
import { NotificationEventPublisher } from "../realtime/publishers/NotificationEventPublisher";
import { MakeAllAsReadNotificationUseCase } from "../../application/notification/use-cases/MarkAllAsReadNotificationUseCase";
import { MarkNotificationAsReadUseCase } from "../../application/notification/use-cases/MarkNotificationAsReadUseCase";
import { NotificationUnreadCountUseCase } from "../../application/notification/use-cases/NotificationUnreadCountUseCase";
import { ConversationRepository } from "../repositories/ConversationRepository";
import { GetUserConversationsUseCase } from "../../application/conversation/use-case/GetUserConversationsUseCase";
import { GetAllMessagesUseCase } from "../../application/conversation/use-case/GetAllMessagesUseCase";
import { MessageRepository } from "../repositories/MessageRepository";
import { ChatEventPublisher } from "../realtime/publishers/ChatEventPublisher";
import { CreateRepMessageUseCase } from "../../application/conversation/use-case/CreateRepMessageUseCase";
import { RepMessageMarkAsReadUseCase } from "../../application/conversation/use-case/RepMessageMarkAsReadUseCase";
import { GetAllSubscriptionsUseCase } from "../../application/subscription/use-cases/GetAllSubscriptionsUseCase";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { CreateCheckoutSessionUseCase } from "../../application/subscription/use-cases/CreateCheckoutSessionUseCase";
import { StripePaymentService } from "../services/StripePaymentService";
import { GetCheckoutDetailsUseCase } from "../../application/subscription/use-cases/GetCheckoutDetailsUseCase";
import { GetSubscriptionStatusUseCase } from "../../application/subscription/use-cases/GetSubscriptionStatusUseCase";
import { GetSubscriptionHistoryUseCase } from "../../application/subscription/use-cases/GetSubscriptionHistoryUseCase";
import { SubscriptionHistoryRepository } from "../repositories/SubscriptionHistoryRepository";
import { ConnectionRequestLogRepository } from "../repositories/ConnectionRequestLogRepository";
import { GetConnectionRequestStatsUseCase } from "../../application/connection/use-cases/GetConnectionRequestStatsUseCase";
import { GetAllProductsUseCase } from "../../application/product/use-cases/GetAllProductsUseCase";
import { CreateProductUseCase } from "../../application/product/use-cases/CreateProductUseCase";
import { ProductRepository } from "../repositories/ProductRepository";
import { EditProductUseCase } from "../../application/product/use-cases/EditProductUseCase";
import { ChangePasswordUseCase } from "../../application/common/use-cases/ChangePasswordUseCase";
import { GuestRepository } from "../repositories/GuestRepository";
import { VerifyOldPasswordUseCase } from "../../application/common/use-cases/VerifyOldPasswordUseCase";
import { GetAllOrdersUseCase } from "../../application/medicalRep/use-cases/GetAllOrdersUseCase";
import { OrderRepository } from "../repositories/OrderRepository";
import { GetOrderDetailsUseCase } from "../../application/medicalRep/use-cases/GetOrderDetailsUseCase";
import { RepBusinessAnalyticsUseCase } from "../../application/medicalRep/use-cases/RepBusinessAnalyticsUseCase";
import { ExportRepOrdersUseCase } from "../../application/medicalRep/use-cases/ExportRepOrdersUseCase";
import { ExcelService } from "../services/ExcelService";
import { VideoCallEventPublisher } from "../realtime/publishers/VideoCallEventPublisher";
import { MakeVideoCallWithDoctorUseCase } from "../../application/medicalRep/use-cases/MakeVideoCallWithDoctorUseCase";
import { UpgradeSubscriptionPlanUseCase } from "../../application/subscription/use-cases/UpgradeSubscriptionPlanUseCase";

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
const notificationEventPublisher = new NotificationEventPublisher();
const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const chatEventPublisher = new ChatEventPublisher();
const subscriptionRepository = new SubscriptionRepository();
const stripePaymentService = new StripePaymentService();
const subscriptionHistoryRepository = new SubscriptionHistoryRepository();
const connectionRequestLogRepository = new ConnectionRequestLogRepository();
const productRepository = new ProductRepository();
const guestRepository = new GuestRepository();

const orderRepository = new OrderRepository();
const excelService = new ExcelService();
const videoCallEventPublisher = new VideoCallEventPublisher();

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
  notificationRepository,
  storageService,
  notificationEventPublisher,
  connectionRequestLogRepository,
  subscriptionRepository
);
const acceptConnectionRequestUseCase = new DoctorAcceptConnectionRequestUseCase(
  medicalRepRepository,
  doctorRepository,
  connectionRepository,
  notificationRepository,
  conversationRepository,
  storageService,
  notificationEventPublisher
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
  productPostRepository
);

const rejectConnectionUseCase = new RepRejectConnectionUseCase(
  medicalRepRepository,
  connectionRepository,
  notificationRepository
);

const acceptConnOnNotUseCase = new RepAcceptConnOnNotUseCase(
  medicalRepRepository,
  connectionRepository,
  notificationRepository,
  conversationRepository,
  doctorRepository,
  storageService,
  notificationEventPublisher
);

const markAllNotificationsAsReadUseCase = new MakeAllAsReadNotificationUseCase(
  notificationRepository,
  notificationEventPublisher
);

const markAsReadNotificationUseCase = new MarkNotificationAsReadUseCase(
  notificationRepository,
  notificationEventPublisher
);

const unReadNotificationsUseCase = new NotificationUnreadCountUseCase(
  notificationRepository
);

const getConversationsUseCase = new GetUserConversationsUseCase(
  conversationRepository,
  storageService,
  medicalRepRepository,
  doctorRepository
);

const getAllMessagesUseCase = new GetAllMessagesUseCase(messageRepository);
const createMessageUseCase = new CreateRepMessageUseCase(
  medicalRepRepository,
  messageRepository,
  chatEventPublisher
);

const messageMarkAseReadUseCase = new RepMessageMarkAsReadUseCase(
  medicalRepRepository,
  conversationRepository,
  messageRepository,
  chatEventPublisher
);

const getAllSubscriptionsUseCase = new GetAllSubscriptionsUseCase(
  subscriptionRepository
);

const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
  subscriptionRepository,
  stripePaymentService,
  medicalRepRepository
);

const getCheckoutDetailsUseCase = new GetCheckoutDetailsUseCase(
  stripePaymentService
);

const getSubscriptionStatusUseCase = new GetSubscriptionStatusUseCase(
  medicalRepRepository
);

const getSubscriptionHistoryUseCase = new GetSubscriptionHistoryUseCase(
  medicalRepRepository,
  subscriptionHistoryRepository
);

const getConnectionRequestStatsUseCase = new GetConnectionRequestStatsUseCase(
  medicalRepRepository,
  connectionRequestLogRepository,
  subscriptionRepository
);

const getAllProductsUseCase = new GetAllProductsUseCase(
  medicalRepRepository,
  productRepository,
  storageService
);

const createProductUseCase = new CreateProductUseCase(
  medicalRepRepository,
  productRepository
);

const editProductUseCase = new EditProductUseCase(
  medicalRepRepository,
  productRepository,
  storageService
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

const getAllOrdersUseCase = new GetAllOrdersUseCase(
  medicalRepRepository,
  orderRepository,
  storageService
);
const getOrderDetailsUseCase = new GetOrderDetailsUseCase(
  medicalRepRepository,
  orderRepository,
  storageService
);

const repBusinessAnalyticsUseCase = new RepBusinessAnalyticsUseCase(
  medicalRepRepository,
  orderRepository,
  storageService
);

const exportRepOrdersUseCase = new ExportRepOrdersUseCase(
  medicalRepRepository,
  orderRepository,
  excelService
);

const makeVideoCallWithDoctorUseCase = new MakeVideoCallWithDoctorUseCase(
  doctorRepository,
  videoCallEventPublisher,
  medicalRepRepository,
  subscriptionRepository
);

const upgradeSubscriptionPlanUseCase = new UpgradeSubscriptionPlanUseCase(
  medicalRepRepository,
  subscriptionRepository,
  stripePaymentService
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
  rejectConnectionUseCase,
  acceptConnOnNotUseCase,
  markAllNotificationsAsReadUseCase,
  markAsReadNotificationUseCase,
  unReadNotificationsUseCase,
  getConversationsUseCase,
  getAllMessagesUseCase,
  createMessageUseCase,
  messageMarkAseReadUseCase,
  getAllSubscriptionsUseCase,
  createCheckoutSessionUseCase,
  getCheckoutDetailsUseCase,
  getSubscriptionStatusUseCase,
  getSubscriptionHistoryUseCase,
  getConnectionRequestStatsUseCase,
  getAllProductsUseCase,
  createProductUseCase,
  editProductUseCase,
  changePasswordUseCase,
  verifyOldPasswordUseCase,
  getAllOrdersUseCase,
  getOrderDetailsUseCase,
  repBusinessAnalyticsUseCase,
  exportRepOrdersUseCase,
  makeVideoCallWithDoctorUseCase,
  upgradeSubscriptionPlanUseCase
);
