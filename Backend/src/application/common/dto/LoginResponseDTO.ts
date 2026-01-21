import { AuthUserDTO } from "./AuthUserDTO";

export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: AuthUserDTO;
}