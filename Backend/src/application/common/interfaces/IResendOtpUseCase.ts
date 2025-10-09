import { OtpResponseDTO } from "../dto/OtpResponseDTO";

export interface IResendOtpUseCase{
    execute(email:string):Promise<OtpResponseDTO>;
}