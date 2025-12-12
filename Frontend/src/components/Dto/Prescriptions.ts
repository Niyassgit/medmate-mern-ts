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
  status: "PENDING" | "APPROVED" | "REJECTED" | "USED" | "EXPIRED";
  expiresAt?: string | Date;
  linkExpiresAt?: string | Date;
  createdAt: string | Date;
  items: PrescriptionItemDTO[];
}
