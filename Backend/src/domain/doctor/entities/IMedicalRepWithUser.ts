import { IUser } from "../../common/entities/IUser";
import { IMedicalRep } from "../../medicalRep/entities/IMedicalRep";

export interface IMedicalRepWithUser extends IMedicalRep{
    user:IUser | null;
}