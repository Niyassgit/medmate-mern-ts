
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { IUpdateOrderStatusUseCase } from "../interfaces/IUpdateOrderStatusUseCase";
import { OrderStatus } from "@prisma/client";

export class UpdateOrderStatusUseCase implements IUpdateOrderStatusUseCase {
    constructor(private _orderRepository: IOrderRepository) { }

    async execute(orderId: string, status: OrderStatus): Promise<IOrder> {
        // cast status to any to bypass the enum mismatch or ensure Repository expects Prisma OrderStatus
        return await this._orderRepository.updateOrder(orderId, { status } as any);
    }
}
