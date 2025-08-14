import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { CreateMedicalRepUseCase } from "../../application/medicalRep/use-cases/CreateMedicalRepUseCase";
import { GetMedicalRepByIdUseCase } from "../../application/medicalRep/use-cases/GetMedicalRepByIdUseCase";
import { BcryptServices } from "../security/BcryptService";
import { GetMedicalRepByEmailUseCase } from "../../application/medicalRep/use-cases/GetMedicalRepByEmailUseCase";
import { MedicalRepController } from "../../presentation/http/controllers/MedicalRepController";

const medicalRepRepository =new MedicalRepRepository();
const bycryptServices=new BcryptServices();
const createDoctorUseCase=new CreateMedicalRepUseCase(medicalRepRepository,bycryptServices);
const getMedicalRepById =new GetMedicalRepByIdUseCase(medicalRepRepository);
const getMedicalRepByEmail=new GetMedicalRepByEmailUseCase(medicalRepRepository);

export const medicalRepController=new MedicalRepController(
    createDoctorUseCase,
    getMedicalRepById,
    getMedicalRepByEmail
);