import { IPrescription } from "../entites/IPrescription";

export interface IPrescriptionRepository {
  createPrescription(
    data: Omit<IPrescription, "id" | "createdAt" | "updatedAt">
  ): Promise<IPrescription>;
  findPrescriptionById(prescriptionId: string): Promise<IPrescription>;
  updatePrescription(
    prescriptionId: string,
    data: Partial<Omit<IPrescription, "id" | "createdAt" | "updatedAt">>
  ): Promise<IPrescription>;
  findAllPrescriptionsByGuestId(GuestId: string): Promise<IPrescription[]>;
  findAllPrescriptionByDoctorId(DoctorId: string): Promise<IPrescription[]>;
}
