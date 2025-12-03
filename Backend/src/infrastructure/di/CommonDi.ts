import { GetAllDepartmentOptionsUseCase } from "../../application/department/use-cases/GellAllDepartmentOptions.UseCase";
import { DepartmentRepository } from "../repositories/DepatmentRepository";
import { CommonController } from "../../presentation/http/controllers/ComonController";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { GetALLTerritoryOptionsUseCase } from "../../application/territory/use-cases/GetAllTerritoryOptionsUseCase";
import { DoctorsPreviewUseCase } from "../../application/doctor/use-cases/DoctorsPreviewUseCase";
import { DoctorRepository } from "../repositories/DoctorRepository";
import { s3StorageService } from "../services/S3StorageService";

const departmentRepository = new DepartmentRepository();
const terrritoryRepository = new TerritoryRepository();
const doctorRepository = new DoctorRepository();
const storageService = new s3StorageService();

const getAllDepartmentOptionsUseCase = new GetAllDepartmentOptionsUseCase(
  departmentRepository
);
const getAllTerritoryOptionsUseCase = new GetALLTerritoryOptionsUseCase(
  terrritoryRepository
);

const getDoctorsForGuest = new DoctorsPreviewUseCase(
  doctorRepository,
  storageService
);
export const commonController = new CommonController(
  getAllDepartmentOptionsUseCase,
  getAllTerritoryOptionsUseCase,
  getDoctorsForGuest
);
