import { IPrescription } from "../entites/IPrescription";
import { IPrescriptionWithItemsAndProduct } from "../entites/IPrescriptionWIthItemsAndProduct";

export interface IPrescriptionRepository {
  createPrescription(
    data: Omit<IPrescription, "id" | "createdAt" | "updatedAt">
  ): Promise<IPrescription>;
  findPrescriptionById(prescriptionId: string): Promise<IPrescription>;
  updatePrescription(
    prescriptionId: string,
    data: Partial<Omit<IPrescription, "id" | "createdAt" | "updatedAt">>
  ): Promise<IPrescription>;
  findAllPrescriptionsByGuestId(GuestId: string): Promise<IPrescriptionWithItemsAndProduct[]>;
  findAllPrescriptionByDoctorId(DoctorId: string): Promise<IPrescription[]>;
  findPrescriptionByShareToken(
    shareToken: string
  ): Promise<IPrescription | null>;
}
