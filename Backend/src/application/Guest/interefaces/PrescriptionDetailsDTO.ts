import { PrescriptionStatus } from "../../../shared/Enums";
import { PrescriptionProductDTO } from "./PrescriptionProductDTO";

export interface PrescriptionDetailsDTO {
  id: string;
  notes?: string;
  status: PrescriptionStatus;
  expiresAt?: Date;
  linkExpiresAt?: Date;
  createdAt: Date;

  items: PrescriptionProductDTO[];
}
