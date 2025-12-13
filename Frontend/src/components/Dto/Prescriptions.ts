import { PrescriptionStatus } from "@/types/PaymentTypes";
import { PrescriptionOrderDTO } from "./PrescriptionOrderDTO";

export interface PrescriptionItemDTO {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  mrp: number;
  image: string | null;
  quantity: number;
  dosage?: string;
  note?: string | null;
}

export interface PrescriptionDTO {
  id: string;
  notes?: string;
  status: PrescriptionStatus;
  expiresAt?: string | Date;
  linkExpiresAt?: string | Date;
  createdAt: string | Date;
  items: PrescriptionItemDTO[];
  order?: PrescriptionOrderDTO | null;
  doctor: {
    name: string;
    hospital: string;
  };
}
