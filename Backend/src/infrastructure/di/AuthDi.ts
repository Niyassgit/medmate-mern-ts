import { AuthController } from "../../presentation/http/controllers/AuthController";
import { LoginDoctorUseCase } from "../../application/doctor/auth/LoginDoctorUseCase";
import { LoginMedicalRepUseCase } from "../../application/medicalRep/auth/LoginMedicalRepUseCase";
import { LoginSuperAdminUseCase } from "../../application/superAdmin/auth/LoginSuperAdminUseCase";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { BcryptServices } from "../security/BcryptService";


const userLoginRepository=new UserLoginRepository();
const bcryptServices=new BcryptServices();


const loginDoctorUseCase=new LoginDoctorUseCase(userLoginRepository,bcryptServices);
const loginMedicalRepUseCase=new LoginMedicalRepUseCase(userLoginRepository,bcryptServices);
const loginSuperAdminUseCase=new LoginSuperAdminUseCase(userLoginRepository,bcryptServices);

export const authController=new AuthController(loginDoctorUseCase,loginMedicalRepUseCase,loginSuperAdminUseCase);