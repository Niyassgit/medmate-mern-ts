import { UserProfileDTO } from "../../common/dto/UserProfileDTO";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";

export interface IGetRepProfileByIdUseCase{
    execute(userId:string):Promise<MedicalRepDetailsDTO | UserProfileDTO | null>;
}