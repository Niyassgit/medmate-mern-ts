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

const superAdminRepositories = new SuperAdminRepository();
const userLoginRepository = new UserRepository();
const bycryptServices = new BcryptServices();
const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();

const createSuperAdminUseCase = new CreateSuperAdminUseCase(
  superAdminRepositories,
  userLoginRepository,
  bycryptServices
);
const getSuperAdminByEmailIdUseCase = new GetSuperAdminByEmailUseCase(
  superAdminRepositories
);
const getAllDoctorsUseCase = new GetAllDoctorsUseCase(doctorRepository);
const getAllRepUseCase = new GetAllRepsUseCase(medicalRepRepository);
const blockUserUseCase = new BlockUserUseCase(userLoginRepository);
const unblockUserUseCase = new UnBlockUserUseCase(userLoginRepository);
const doctorDetails = new GetDoctorDetailsUseCase(doctorRepository);
const medicalRepDetails = new GetMedicalRepDetailsUseCase(medicalRepRepository);

export const superAdminController = new SuperAdminController(
  createSuperAdminUseCase,
  getSuperAdminByEmailIdUseCase,
  getAllDoctorsUseCase,
  getAllRepUseCase,
  blockUserUseCase,
  unblockUserUseCase,
  doctorDetails,
  medicalRepDetails
);
