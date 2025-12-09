import { RegisterRepResponseDTO } from "../../medicalRep/dto/RegisterRepResponseDTO";
import { RegisterPatientDTO } from "../dto/RegisterPatientDTO";

export interface ICreatePatientUseCase {
  execute(dto: RegisterPatientDTO): Promise<RegisterRepResponseDTO>;
}
