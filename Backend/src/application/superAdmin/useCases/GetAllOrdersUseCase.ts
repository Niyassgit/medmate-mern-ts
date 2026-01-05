import { UnautharizedError } from "../../../domain/common/errors";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IGetAllOrdersUseCase } from "../interfaces/IGetAllOrdersUseCase";
import { OrdersListResponseDTO } from "../dto/OrdersListResponseDTO";
import { OrderMapper } from "../../../infrastructure/mappers/OrderMapper";

export class GetAllOrdersUseCase implements IGetAllOrdersUseCase {
  constructor(private _orderRepository: IOrderRepository) { }
  async execute(
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    status?: string,
    userId?: string
  ): Promise<OrdersListResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    const { orders, total } = await this._orderRepository.getAllOrders(
      page,
      limit,
      start,
      end,
      status
    );

    const mappedOrders = orders.map((order) => OrderMapper.toTableDTO(order));

    return {
      orders: mappedOrders,
      total,
    };
  }
}

