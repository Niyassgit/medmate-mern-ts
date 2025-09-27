import { IUser } from "../../common/entities/IUser";
import { IDoctor } from "./IDoctor";

export interface IDoctorWithUser extends IDoctor {
  user: IUser | null;
}
