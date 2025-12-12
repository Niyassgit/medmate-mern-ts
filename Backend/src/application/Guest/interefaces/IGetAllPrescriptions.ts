import { PrescriptionDetailsDTO } from "./PrescriptionDetailsDTO";

export interface IGetAllPrescriptionsUseCase{
    execute(userId?:string):Promise<PrescriptionDetailsDTO[]>;
}