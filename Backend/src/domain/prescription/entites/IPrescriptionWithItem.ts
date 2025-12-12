import { PrescriptionStatus } from "../../../shared/Enums";
import { IPrescriptionItem } from "./IPrescriptionItem";

export interface IPrescriptionWithItem {
  id: string;
  doctorId: string;
  guestId: string;
  notes?: string;
  status: PrescriptionStatus;
  expiresAt?: Date;
  shareToken?: string;
  linkExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  items: IPrescriptionItem[];
}
