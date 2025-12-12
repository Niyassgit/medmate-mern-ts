import { PrescriptionStatus } from "../../../shared/Enums";
import { PrescriptionItemDTO } from "./PrescriptionItemDTO";

export interface PrescriptionDTO{
     notes?:string;
     status?:PrescriptionStatus,
     expiresAt?:Date,
     shareToken?:string,
     linkExpiresAt?:Date,
     items: PrescriptionItemDTO[];
}