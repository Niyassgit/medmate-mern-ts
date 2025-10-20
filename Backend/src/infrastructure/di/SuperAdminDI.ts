import { SuperAdminController } from "../../presentation/http/controllers/SuperAdminController";
import { CreateSuperAdminUseCase } from "../../application/superAdmin/auth/CreateSuperAdminUseCase";
import { GetSuperAdminByEmailUseCase } from "../../application/superAdmin/auth/GetSuperAdminByEmailUseCase";
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
import { GetTerritoriesUseCase } from "../../application/territory/use-cases/GetTerritoriesUseCase";
import { EditTerritoryUseCase } from "../../application/territory/use-cases/EditTerrritoryUseCase";
import { CreateDepartmentUseCase } from "../../application/department/use-cases/CreateDepartmentUseCase";
import { DepartmentRepository } from "../repositories/DepatmentRepository";
import { GetAllDepartmentsUseCase } from "../../application/department/use-cases/GetAllDepartmentsUseCase";
import { EditDepartmentUseCase } from "../../application/department/use-cases/EditDepartmentUseCase";

const superAdminRepositories = new SuperAdminRepository();
const userRepository = new UserRepository();
const bycryptServices = new BcryptServices();
const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();
const terrritoryRepository = new TerritoryRepository();
const departmentRepository = new DepartmentRepository();

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
const doctorDetails = new GetDoctorDetailsUseCase(doctorRepository);
const medicalRepDetails = new GetMedicalRepDetailsUseCase(medicalRepRepository);
const getTerritoryUseCase = new GetTerritoriesUseCase(
  userRepository,
  terrritoryRepository
);
const createTerritoryUseCase = new CreateTerritoryUseCase(
  userRepository,
  terrritoryRepository
);
const editTerritoryUseCase = new EditTerritoryUseCase(
  userRepository,
  terrritoryRepository
);
const createDepartmentUseCase = new CreateDepartmentUseCase(
  userRepository,
  departmentRepository
);
const getAllDepartmentsUseCase = new GetAllDepartmentsUseCase(
  userRepository,
  departmentRepository
);
const editDepartmentUseCase = new EditDepartmentUseCase(
  userRepository,
  departmentRepository
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
  editDepartmentUseCase
);
