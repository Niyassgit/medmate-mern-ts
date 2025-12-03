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
  getAdminDashboardSummaryUseCase
);
