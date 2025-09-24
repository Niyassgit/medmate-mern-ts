import { IUser } from "../../../domain/common/entities/IUser";

export type GooglePrecheckResultDTO =
  | { exists: false }
  | { exists: true; accessToken: string; refreshToken: string; user: IUser };
