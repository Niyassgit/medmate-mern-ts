import { AuthUserDTO } from "./AuthUserDTO";

export interface GooglePrecheckResultDTO {
  exists: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUserDTO;
}
;
