import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { RegisterResponseDTO } from "../dto/RegisterResponseDTO";

export interface ICreateDoctorUseCase{
  execute(data:RegisterDoctorDTO):Promise<RegisterResponseDTO>;
}