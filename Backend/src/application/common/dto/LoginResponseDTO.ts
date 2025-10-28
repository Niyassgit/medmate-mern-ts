import { UserProfileDTO } from "./UserProfileDTO";

export interface LoginResponseDTO{
    accessToken:string,
    refreshToken:string,
    mappedUser:UserProfileDTO,  
}