import { PrescriptionStatus } from "@prisma/client";

export interface IPrescription{
 id:string;
 doctorId:string;
 guestId:string;
 notes?:string;
 status:PrescriptionStatus,
 expiresAt?:Date,
 shareToken?:string,
 linkExpiresAt?:Date,
 createdAt:Date,
 updatedAt:Date,
}
