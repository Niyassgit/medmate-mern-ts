import { RegisterMedicalRepDTO } from "../dto/RegisterMedicalRepDTO";
import { RegisterRepResponseDTO } from "../dto/RegisterRepResponseDTO";

export interface ICreateMedicalRepUseCase{
    execute(data:RegisterMedicalRepDTO):Promise<RegisterRepResponseDTO>;
}