
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IOrderDetail } from "../../../domain/order/entitiy/IOrderDetail";
import { IGetOrderDetailsUseCase } from "../interfaces/IGetOrderDetailsUseCase";

export class GetOrderDetailsUseCase implements IGetOrderDetailsUseCase {
    constructor(private _orderRepository: IOrderRepository) { }

    async execute(orderId: string): Promise<IOrderDetail | null> {
        return await this._orderRepository.findOrderDetailsById(orderId);
    }
}
