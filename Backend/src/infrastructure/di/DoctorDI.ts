import { DoctorRepository } from "../repositories/DoctorRepository";
import { BcryptServices } from "../security/BcryptService";
import { CreateDoctorUseCase } from "../../application/doctor/use-cases/CreateDoctorUseCase";
import { GetDoctorProfileByIdUseCase } from "../../application/doctor/use-cases/GetDoctorProfileByIdUseCase";
import { GetDoctorProfileByEmailUseCase } from "../../application/doctor/use-cases/GetDoctorProfileByEmailUseCase";
import { DoctorController } from "../../presentation/http/controllers/DoctorController";

const doctorRepository=new DoctorRepository();
const bycryptServices=new BcryptServices();
const createDoctorUseCase=new CreateDoctorUseCase(doctorRepository,bycryptServices);
const getDoctorProfileByIdUseCase=new GetDoctorProfileByIdUseCase(doctorRepository);
const getDoctorProfileByEmailUseCase=new GetDoctorProfileByEmailUseCase(doctorRepository);

export const doctorController=new DoctorController(
    createDoctorUseCase,
    getDoctorProfileByIdUseCase,
    getDoctorProfileByEmailUseCase
);
