import { IUser } from "../../common/entities/IUser";
import { IMedicalRep } from "./IMedicalRep";

export interface IMedicalRepWithUser extends IMedicalRep{
    user:IUser | null;
}