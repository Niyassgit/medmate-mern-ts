import { PrescriptionDetailsDTO } from "../../Guest/interefaces/PrescriptionDetailsDTO";

export interface IGetAllPrescriptionsMadeUseCase{
    execute(userId?:string):Promise<PrescriptionDetailsDTO[]>
}