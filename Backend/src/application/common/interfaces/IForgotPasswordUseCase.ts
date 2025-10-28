import { ForgotResponseDTO } from "../dto/ForgotResponseDTO";


export interface IForgotPasswordUseCase{
    execute(email:string):Promise<ForgotResponseDTO>
}