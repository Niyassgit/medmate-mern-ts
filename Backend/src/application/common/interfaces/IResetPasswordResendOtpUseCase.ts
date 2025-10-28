import { OtpResponseDTO } from "../dto/OtpResponseDTO";

export interface IResetPasswordResendOtpUseCase{
    execute(email:string):Promise<OtpResponseDTO>;
}