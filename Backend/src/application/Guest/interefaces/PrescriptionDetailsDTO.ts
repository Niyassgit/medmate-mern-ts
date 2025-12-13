import { PrescriptionStatus } from "../../../shared/Enums";
import { PrescriptionOrderDTO } from "../dto/PrescriptionOrderDTO";
import { PrescriptionProductDTO } from "./PrescriptionProductDTO";

export interface PrescriptionDetailsDTO {
  id: string;
  notes?: string;
  status: PrescriptionStatus;
  expiresAt?: Date;
  linkExpiresAt?: Date;
  createdAt: Date;

  items: PrescriptionProductDTO[];
  order?: PrescriptionOrderDTO | null;
  doctor: {
    name: string;
    hospital: string;
  };
}
