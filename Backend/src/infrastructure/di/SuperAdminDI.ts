import { SuperAdminController } from "../../presentation/http/controllers/SuperAdminController";
import { CreateSuperAdminUseCase } from "../../application/superAdmin/auth/CreateSuperAdminUseCase";
import { GetSuperAdminByEmailUseCase } from "../../application/superAdmin/useCases/GetSuperAdminByEmailUseCase";
import { BcryptServices } from "../services/BcryptService";
import { SuperAdminRepository } from "../repositories/SuperAdminRepository";
import { UserRepository } from "../repositories/UserRepository";
import { GetAllDoctorsUseCase } from "../../application/superAdmin/useCases/GetAllDoctorsUseCase";
import { DoctorRepository } from "../repositories/DoctorRepository";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { GetAllRepsUseCase } from "../../application/superAdmin/useCases/GetAllRepsUseCase";
import { BlockUserUseCase } from "../../application/superAdmin/useCases/BlockUserUseCase";
import { UnBlockUserUseCase } from "../../application/superAdmin/useCases/UnblockUserUseCase";
import { GetDoctorDetailsUseCase } from "../../application/superAdmin/useCases/GetDoctorDetailsUseCase";
import { GetMedicalRepDetailsUseCase } from "../../application/superAdmin/useCases/GetMedicalRepDetailsUseCase";
import { CreateTerritoryUseCase } from "../../application/territory/use-cases/CreateTerritoryUseCase";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { GetTerritoriesUseCase } from "../../application/superAdmin/useCases/GetTerritoriesUseCase";
import { EditTerritoryUseCase } from "../../application/territory/use-cases/EditTerrritoryUseCase";
import { CreateDepartmentUseCase } from "../../application/department/use-cases/CreateDepartmentUseCase";
import { DepartmentRepository } from "../repositories/DepatmentRepository";
import { GetAllDepartmentsUseCase } from "../../application/superAdmin/useCases/GetAllDepartmentsUseCase";
import { EditDepartmentUseCase } from "../../application/department/use-cases/EditDepartmentUseCase";
import { s3StorageService } from "../services/S3StorageService";
import { GetAllSubscriptionsUseCase } from "../../application/subscription/use-cases/GetAllSubscriptionsUseCase";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { CreateSubscriptionPlanUseCase } from "../../application/subscription/use-cases/CreateSubscriptionPlanUseCase";
import { UpdateSubscriptionPlanUseCase } from "../../application/subscription/use-cases/UpdateSubscriptionPlanUseCase";
import { ListToggleSubscriptionPlanUseCase } from "../../application/subscription/use-cases/ListToggleSubscriptionPlanUseCase";
import { DeleteSubscriptionPlanUseCase } from "../../application/subscription/use-cases/DeleteSubscriptionUseCase";
import { GetAdminDashboardSummaryUseCase } from "../../application/superAdmin/useCases/GetAdminDashBoardSummaryUseCase";
import { SubscriptionHistoryRepository } from "../repositories/SubscriptionHistoryRepository";
import { ProductPostRepository } from "../repositories/ProductPostRepository";
import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { GetUserDistributionUseCase } from "../../application/superAdmin/useCases/GetUserDistributionUseCase";
import { GetUserGrowthUseCase } from "../../application/superAdmin/useCases/GetUserGrowthUseCase";
import { GetRevenueByTierUseCase } from "../../application/superAdmin/useCases/GetRevenueByTierUseCase";
import { GetRecentSubscriptionsUseCase } from "../../application/superAdmin/useCases/GetRecentSubscriptionsUseCase";
import { GetSubscribedListUseCase } from "../../application/superAdmin/useCases/GetSubscribedListUseCase";
import { GetAllGuestsUseCase } from "../../application/superAdmin/useCases/GetAllGuestsUseCase";
import { GuestRepository } from "../repositories/GuestRepository";
import { TerritoryDetailsUseCase } from "../../application/superAdmin/useCases/TerritoryDetailsUseCase";
import { AdminOrderAnalyticsUseCase } from "../../application/superAdmin/useCases/AdminOrderAnalyticsUseCase";
import { OrderRepository } from "../repositories/OrderRepository";
import { PrescriptionRepository } from "../repositories/PrescriptionRepository";
import { GetDoctorEarningsUseCase } from "../../application/superAdmin/useCases/GetDoctorEarningsUseCase";
import { GetAdminEarningsUseCase } from "../../application/superAdmin/useCases/GetAdminEarningsUseCase";
import { GetAllOrdersUseCase } from "../../application/superAdmin/useCases/GetAllOrdersUseCase";

const superAdminRepositories = new SuperAdminRepository();
const userRepository = new UserRepository();
const bycryptServices = new BcryptServices();
const storageService = new s3StorageService();
const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();
const terrritoryRepository = new TerritoryRepository();
const departmentRepository = new DepartmentRepository();
const subscriptionRepository = new SubscriptionRepository();
const subscriptionHistoryRepository = new SubscriptionHistoryRepository();
const productPostRepository = new ProductPostRepository();
const connectionRepository = new ConnectionRepository();
const guestRepository = new GuestRepository();
const orderRepository = new OrderRepository();
const prescriptionRepository = new PrescriptionRepository();

const createSuperAdminUseCase = new CreateSuperAdminUseCase(
  superAdminRepositories,
  userRepository,
  bycryptServices
);
const getSuperAdminByEmailIdUseCase = new GetSuperAdminByEmailUseCase(
  superAdminRepositories
);
const getAllDoctorsUseCase = new GetAllDoctorsUseCase(doctorRepository);
const getAllRepUseCase = new GetAllRepsUseCase(medicalRepRepository);
const blockUserUseCase = new BlockUserUseCase(userRepository);
const unblockUserUseCase = new UnBlockUserUseCase(userRepository);
const doctorDetails = new GetDoctorDetailsUseCase(
  doctorRepository,
  storageService
);
const medicalRepDetails = new GetMedicalRepDetailsUseCase(
  medicalRepRepository,
  storageService
);
const getTerritoryUseCase = new GetTerritoriesUseCase(
  userRepository,
  terrritoryRepository
);
const createTerritoryUseCase = new CreateTerritoryUseCase(terrritoryRepository);
const editTerritoryUseCase = new EditTerritoryUseCase(terrritoryRepository);
const createDepartmentUseCase = new CreateDepartmentUseCase(
  departmentRepository
);
const getAllDepartmentsUseCase = new GetAllDepartmentsUseCase(
  userRepository,
  departmentRepository
);
const editDepartmentUseCase = new EditDepartmentUseCase(departmentRepository);
const getAllSubscriptionPlanUseCase = new GetAllSubscriptionsUseCase(
  subscriptionRepository
);
const createSubscriptionUseCase = new CreateSubscriptionPlanUseCase(
  subscriptionRepository
);

const updateSubscriptionPlan = new UpdateSubscriptionPlanUseCase(
  subscriptionRepository
);

const toggleSubscriptionUseCase = new ListToggleSubscriptionPlanUseCase(
  subscriptionRepository
);

const deleteSubscriptionUseCase = new DeleteSubscriptionPlanUseCase(
  subscriptionRepository
);

const getAdminDashboardSummaryUseCase = new GetAdminDashboardSummaryUseCase(
  medicalRepRepository,
  doctorRepository,
  subscriptionHistoryRepository,
  productPostRepository,
  connectionRepository,
  userRepository
);

const getUserDistributionUseCase = new GetUserDistributionUseCase(
  doctorRepository,
  medicalRepRepository
);

const getUserGrowthUseCase = new GetUserGrowthUseCase(
  doctorRepository,
  medicalRepRepository
);

const getRevenueByTierUseCase = new GetRevenueByTierUseCase(
  subscriptionHistoryRepository
);

const getRecentSubscriptionsUseCase = new GetRecentSubscriptionsUseCase(
  subscriptionHistoryRepository
);

const getSubscribedListUseCase = new GetSubscribedListUseCase(
  subscriptionHistoryRepository
);

const getAllGuestsUseCase = new GetAllGuestsUseCase(guestRepository);
const territoryDetailsUseCase = new TerritoryDetailsUseCase(
  terrritoryRepository
);

const adminOrderAnalytics = new AdminOrderAnalyticsUseCase(
  orderRepository,
  prescriptionRepository
);


const getDoctorEarningsUseCase = new GetDoctorEarningsUseCase(orderRepository);
const getAdminEarningsUseCase = new GetAdminEarningsUseCase(orderRepository);

const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);

export const superAdminController = new SuperAdminController(
  createSuperAdminUseCase,
  getSuperAdminByEmailIdUseCase,
  getAllDoctorsUseCase,
  getAllRepUseCase,
  blockUserUseCase,
  unblockUserUseCase,
  doctorDetails,
  medicalRepDetails,
  getTerritoryUseCase,
  createTerritoryUseCase,
  editTerritoryUseCase,
  createDepartmentUseCase,
  getAllDepartmentsUseCase,
  editDepartmentUseCase,
  getAllSubscriptionPlanUseCase,
  createSubscriptionUseCase,
  updateSubscriptionPlan,
  toggleSubscriptionUseCase,
  deleteSubscriptionUseCase,
  getAdminDashboardSummaryUseCase,
  getUserDistributionUseCase,
  getUserGrowthUseCase,
  getRevenueByTierUseCase,
  getRecentSubscriptionsUseCase,
  getSubscribedListUseCase,
  getAllGuestsUseCase,
  territoryDetailsUseCase,
  adminOrderAnalytics,
  getDoctorEarningsUseCase,
  getAdminEarningsUseCase,
  getAllOrdersUseCase
);
