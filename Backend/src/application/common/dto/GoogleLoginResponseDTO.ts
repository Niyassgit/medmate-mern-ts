import { IUser } from "../../../domain/common/entities/IUser";

export interface GoogleLoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
