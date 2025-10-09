import { LoginResponseDTO } from "../dto/LoginResponseDTO";

export interface ILoginUserUseCase{
    execute(email:string,password:string):Promise<LoginResponseDTO>;
}