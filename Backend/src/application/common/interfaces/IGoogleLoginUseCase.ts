import { GoogleLoginDTO } from "../dto/GoogleLoginDTO";
import { GoogleLoginResponseDTO } from "../dto/GoogleLoginResponseDTO";

export interface IGoogleLoginUseCase{
    execute(payload:GoogleLoginDTO):Promise<GoogleLoginResponseDTO>;
}