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

const superAdminRepositories = new SuperAdminRepository();
const userRepository = new UserRepository();
const bycryptServices = new BcryptServices();
const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();
const terrritoryRepository= new TerritoryRepository();

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
const getTerritoryUseCase=new GetTerritoriesUseCase(userRepository,terrritoryRepository)
const createTerritoryUseCase=new CreateTerritoryUseCase(userRepository,terrritoryRepository)

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
);
