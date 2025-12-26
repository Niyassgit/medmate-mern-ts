
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IGetOrderDetailsUseCase } from "../interfaces/IGetOrderDetailsUseCase";
import { OrderDetailsResponseDTO } from "../dto/OrderDetailsResponseDTO";
import { OrderAnalyticsMapper } from "../mappers/OrderAnalyticsMapper";

export class GetOrderDetailsUseCase implements IGetOrderDetailsUseCase {
    constructor(private _orderRepository: IOrderRepository) { }

    async execute(orderId: string): Promise<OrderDetailsResponseDTO | null> {
        const order = await this._orderRepository.findOrderDetailsById(orderId);
        if (!order) return null;

        return OrderAnalyticsMapper.toOrderDetails(order);
    }
}
