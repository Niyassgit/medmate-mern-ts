import { OrderStatus } from "../../../shared/Enums";

export interface RepOrderDTO {
  id: string;
  prescriptionId: string;
  doctorName: string;
  hospital: string;
  status: OrderStatus;
  totalAmount: string;
  totalUnits: number;
  createdAt: Date;
  products: {
    id: string;
    name: string;
    image: string | null;
    ptr: number;
    unit: number;
  }[]
}
