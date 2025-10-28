import { MedicalRepDetailsDTO } from "../../medicalRep/dto/MedicalRepDetailsDTO";

export interface IGetMedicalRepDetailsUseCase {
  execute(userId: string): Promise<MedicalRepDetailsDTO | null>;
}
