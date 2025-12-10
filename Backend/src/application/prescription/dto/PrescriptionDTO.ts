import { PrescriptionStatus } from "@prisma/client";
import { PrescriptionItemDTO } from "./PrescriptionItemDTO";

export interface PrescriptionDTO{
     notes?:string;
     status?:PrescriptionStatus,
     expiresAt?:Date,
     shareToken?:string,
     linkExpiresAt?:Date,
     items: PrescriptionItemDTO[];
}