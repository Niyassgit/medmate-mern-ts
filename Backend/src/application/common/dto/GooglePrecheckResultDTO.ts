import { IUser } from "../../../domain/common/entities/IUserLogin";

export type GooglePrecheckResultDTO= |{exists:false}|{exists:true;accessToken:string;refreshToken:string;user:IUser}