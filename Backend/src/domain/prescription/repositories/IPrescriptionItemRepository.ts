import { IPrescriptionItem } from "../entites/IPrescriptionItem";

export interface IPrescriptionItemRepository {
  createPrescriptionItem(
    data: Omit<IPrescriptionItem, "id">
  ): Promise<IPrescriptionItem>;
  createPrescriptionItems(
    items: Omit<IPrescriptionItem, "id">[]
  ): Promise<IPrescriptionItem[]>;
  findPrescriptionItemsByPrescriptionId(
    prescriptionId: string
  ): Promise<IPrescriptionItem[]>;
  deletePrescriptionItem(itemId: string): Promise<boolean>;
}

