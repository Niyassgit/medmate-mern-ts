import { OrderTableDTO } from "./OrderTableDTO";

export interface OrdersListResponseDTO {
    orders: OrderTableDTO[];
    total: number;
}
