import { PrescriptionDetailsDTO } from "../../guest/interefaces/PrescriptionDetailsDTO";

export interface IGetAllPrescriptionsMadeUseCase{
    execute(userId?:string):Promise<PrescriptionDetailsDTO[]>
}