import { MedicalRepController } from "../../presentation/http/controllers/MedicalRepController";
import { BcryptServices } from "../security/BcryptService";
import { CreateMedicalRepUseCase } from "../../application/medicalRep/use-cases/auth/CreateMedicalRepUseCase"; 
import { GetMedicalRepByIdUseCase } from "../../application/medicalRep/use-cases/auth/GetMedicalRepByIdUseCase"; 
import { GetMedicalRepByEmailUseCase } from "../../application/medicalRep/use-cases/auth/GetMedicalRepByEmailUseCase"; 
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { UserLoginRepository } from "../repositories/UserLoginRepository";


const medicalRepRepository=new MedicalRepRepository();
const  userLoginRepository=new UserLoginRepository()
const bcryptServices=new BcryptServices();
const createMedicalRepUseCase=new CreateMedicalRepUseCase(medicalRepRepository,bcryptServices,userLoginRepository);
const getMedicalRepByEmailUseCase=new GetMedicalRepByEmailUseCase(medicalRepRepository);
const getMedicalRepByIduseCase=new GetMedicalRepByIdUseCase(medicalRepRepository);



export const  medicalRepController=new MedicalRepController(
    createMedicalRepUseCase,
    getMedicalRepByIduseCase,
    getMedicalRepByEmailUseCase
)