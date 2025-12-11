import { PrescriptionStatus } from "../../../shared/Enums";
import { PrescriptionProductDTO } from "./PrescriptionProductDTO";

export interface PrescriptionDetailsDTO{
     notes?:string;
     status?:PrescriptionStatus,
     expiresAt?:Date,
     shareToken?:string,
     linkExpiresAt?:Date,
     items: PrescriptionProductDTO[];
}