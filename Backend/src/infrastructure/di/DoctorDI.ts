import { DoctorRepository } from "../repositories/DoctorRepository";
import { BcryptServices } from "../services/BcryptService";
import { CreateDoctorUseCase } from "../../application/doctor/auth/CreateDoctorUseCase"; 
import { GetDoctorProfileByIdUseCase } from "../../application/doctor/auth/GetDoctorProfileByIdUseCase"; 
import { GetDoctorProfileByEmailUseCase } from "../../application/doctor/auth/GetDoctorProfileByEmailUseCase"; 
import { DoctorController } from "../../presentation/http/controllers/DoctorController";
import { UserLoginRepository } from "../repositories/UserLoginRepository";

const doctorRepository=new DoctorRepository();
const bycryptServices=new BcryptServices();
const userLoginRepository=new UserLoginRepository()
const createDoctorUseCase=new CreateDoctorUseCase(doctorRepository,bycryptServices,userLoginRepository);
const getDoctorProfileByIdUseCase=new GetDoctorProfileByIdUseCase(doctorRepository);
const getDoctorProfileByEmailUseCase=new GetDoctorProfileByEmailUseCase(doctorRepository);

export const doctorController=new DoctorController(
    createDoctorUseCase,
    getDoctorProfileByIdUseCase,
    getDoctorProfileByEmailUseCase
);
