import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IUpdateOrderStatusUseCase } from "../interfaces/IUpdateOrderStatusUseCase";
import { OrderStatus } from "../../../shared/Enums";
import { UpdateOrderStatusResponseDTO } from "../dto/UpdateOrderStatusResponseDTO";
import { OrderAnalyticsMapper } from "../mappers/OrderAnalyticsMapper";

export class UpdateOrderStatusUseCase implements IUpdateOrderStatusUseCase {
  constructor(private _orderRepository: IOrderRepository) {}

  async execute(
    orderId: string,
    status: OrderStatus
  ): Promise<UpdateOrderStatusResponseDTO> {
    const updatedOrder = await this._orderRepository.updateOrder(orderId, {
      status,
    });

    return OrderAnalyticsMapper.toOrderUpdate(updatedOrder);
  }
}
