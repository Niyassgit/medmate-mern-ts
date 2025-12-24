import { OrderStatus } from "@/types/PaymentTypes";

export interface OrderTableDTO {
  id: string;
  name: string;
  units: string;
  ptr: number;
  orderStatus: OrderStatus;
}
