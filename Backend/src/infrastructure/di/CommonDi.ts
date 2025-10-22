import { GetAllDepartmentOptionsUseCase } from "../../application/department/use-cases/GellAllDepartmentOptions.UseCase";
import { DepartmentRepository } from "../repositories/DepatmentRepository";
import { CommonController } from "../../presentation/http/controllers/ComonController";
import { TerritoryRepository } from "../repositories/TerritoryRepository";
import { GetALLTerritoryOptionsUseCase } from "../../application/territory/use-cases/GetAllTerritoryOptionsUseCase";

const departmentRepository = new DepartmentRepository();
const terrritoryRepository = new TerritoryRepository();
const getAllDepartmentOptionsUseCase = new GetAllDepartmentOptionsUseCase(
  departmentRepository
);
const getAllTerritoryOptionsUseCase = new GetALLTerritoryOptionsUseCase(
  terrritoryRepository
);

export const commonController = new CommonController(
  getAllDepartmentOptionsUseCase,
  getAllTerritoryOptionsUseCase
);
