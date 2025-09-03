import { SuperAdminController } from "../../presentation/http/controllers/SuperAdminController";
import { CreateSuperAdminUseCase } from "../../application/superAdmin/auth/CreateSuperAdminUseCase"; 
import { GetSuperAdminByEmailIdUseCase } from "../../application/superAdmin/auth/GetSuperAdminByEmailIdUseCase"; 
import { BcryptServices } from "../services/BcryptService";
import { SuperAdminRepository } from "../repositories/SuperAdminRepository";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { GetAllDoctorsUseCase } from "../../application/superAdmin/useCases/GetAllDoctorsUseCase";
import { DoctorRepository } from "../repositories/DoctorRepository";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { GetAllRepsUseCase } from "../../application/superAdmin/useCases/GetAllRepsUseCase";

const superAdminRepositories=new SuperAdminRepository();
const userLoginRepository=new UserLoginRepository()
const bycryptServices=new BcryptServices();
const doctorRepository=new DoctorRepository();
const medicalRepRepository=new MedicalRepRepository();

const createSuperAdminUseCase=new CreateSuperAdminUseCase(superAdminRepositories,userLoginRepository,bycryptServices);
const getSuperAdminByEmailIdUseCase=new GetSuperAdminByEmailIdUseCase(superAdminRepositories);
const getAllDoctorsUseCase=new GetAllDoctorsUseCase(doctorRepository);
const getAllRepUseCase=new GetAllRepsUseCase(medicalRepRepository);

export const superAdminController=new SuperAdminController(
    createSuperAdminUseCase,
    getSuperAdminByEmailIdUseCase,
    getAllDoctorsUseCase,
    getAllRepUseCase
);