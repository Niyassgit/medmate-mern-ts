export interface IPrescriptionItem {
  id: string;
  prescriptionId: string;
  productId: string;
  productPostId?: string | null;
  dosage?: string | null;
  quantity: number;
}

