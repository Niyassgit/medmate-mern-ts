import { MedicalRepController } from "../../presentation/http/controllers/MedicalRepController";
import { BcryptServices } from "../services/BcryptService";
import { CreateMedicalRepUseCase } from "../../application/medicalRep/auth/CreateMedicalRepUseCase"; 
import { GetMedicalRepByIdUseCase } from "../../application/medicalRep/auth/GetMedicalRepByIdUseCase"; 
import { GetMedicalRepByEmailUseCase } from "../../application/medicalRep/auth/GetMedicalRepByEmailUseCase"; 
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { OtpService } from "../services/OtpService";
import { NotificationService } from "../services/NotificationService";

const medicalRepRepository=new MedicalRepRepository();
const  userLoginRepository=new UserLoginRepository()
const bcryptServices=new BcryptServices();
const otpService=new OtpService();
const notificationService=new NotificationService()

const createMedicalRepUseCase=new CreateMedicalRepUseCase(medicalRepRepository,bcryptServices,userLoginRepository,otpService,notificationService);
const getMedicalRepByEmailUseCase=new GetMedicalRepByEmailUseCase(medicalRepRepository);
const getMedicalRepByIduseCase=new GetMedicalRepByIdUseCase(medicalRepRepository);



export const  medicalRepController=new MedicalRepController(
    createMedicalRepUseCase,
    getMedicalRepByIduseCase,
    getMedicalRepByEmailUseCase
)