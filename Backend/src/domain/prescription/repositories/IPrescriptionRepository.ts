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
  findAllPrescriptionsByGuestId(guestId: string): Promise<IPrescriptionWithItemsAndProduct[]>;
  findAllPrescriptionByDoctorId(doctorId: string): Promise<IPrescriptionWithItemsAndProduct[]>;
  findPrescriptionByShareToken(
    shareToken: string
  ): Promise<IPrescription | null>;
  findPrescriptionByIdWithItems(id: string): Promise<IPrescriptionWithItemsAndProduct | null>;
}
