
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { OrderStatus } from "@prisma/client";

export interface IUpdateOrderStatusUseCase {
    execute(orderId: string, status: OrderStatus): Promise<IOrder>;
}
