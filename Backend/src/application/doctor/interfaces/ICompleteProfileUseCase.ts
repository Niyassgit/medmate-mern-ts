import { CompleteDoctorProfileDTO } from "../dto/CompleteProfileDTO";

export interface ICompleteProfileUseCase{
    execute(userId:string,data:CompleteDoctorProfileDTO):Promise<string>;
}