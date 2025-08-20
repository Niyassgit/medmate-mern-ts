import { SuperAdminController } from "../../presentation/http/controllers/SuperAdminController";
import { CreateSuperAdminUseCase } from "../../application/superAdmin/auth/CreateSuperAdminUseCase"; 
import { GetSuperAdminByEmailIdUseCase } from "../../application/superAdmin/auth/GetSuperAdminByEmailIdUseCase"; 
import { BcryptServices } from "../security/BcryptService";
import { SuperAdminRepository } from "../repositories/SuperAdminRepository";
import { UserLoginRepository } from "../repositories/UserLoginRepository";


const superAdminRepositories=new SuperAdminRepository();
const userLoginRepository=new UserLoginRepository()
const bycryptServices=new BcryptServices();
const createSuperAdminUseCase=new CreateSuperAdminUseCase(superAdminRepositories,userLoginRepository,bycryptServices);
const getSuperAdminByEmailIdUseCase=new GetSuperAdminByEmailIdUseCase(superAdminRepositories);

export const superAdminController=new SuperAdminController(
    createSuperAdminUseCase,
    getSuperAdminByEmailIdUseCase
);