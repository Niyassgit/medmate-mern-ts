import { UserProfileDTO } from "../../common/dto/UserProfileDTO";
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO";

export interface IGetDoctorProfileByIdUseCase{
    execute(userId:string):Promise<DoctorDetailsDTO | UserProfileDTO | null>;
}