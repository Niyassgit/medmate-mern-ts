import { RegisterRepResponseDTO } from "../../medicalRep/dto/RegisterRepResponseDTO";
import { RegisterGuestDTO } from "../dto/RegisterPatientDTO";

export interface ICreateGuestUseCase {
  execute(dto: RegisterGuestDTO): Promise<RegisterRepResponseDTO>;
}
