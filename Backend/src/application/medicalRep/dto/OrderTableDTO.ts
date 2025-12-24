import { OrderStatus } from "../../../shared/Enums";

export interface OrderTableDTO {
  id: string;
  name: string;
  units: string;
  ptr: number;
  orderStatus: OrderStatus;
}
