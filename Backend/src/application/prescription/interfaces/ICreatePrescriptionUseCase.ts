import { PrescriptionDTO } from "../dto/PrescriptionDTO";

export interface ICreatePrescriptionUseCase{
    execute(guestId:string,dto:PrescriptionDTO,userId?:string):Promise<string>;
}