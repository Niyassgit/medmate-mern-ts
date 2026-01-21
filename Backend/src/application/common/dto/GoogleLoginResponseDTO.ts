import { AuthUserDTO } from "./AuthUserDTO";

export interface GoogleLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDTO;
}
