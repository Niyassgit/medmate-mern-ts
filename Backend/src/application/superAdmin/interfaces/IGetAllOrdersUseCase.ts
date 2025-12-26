import { OrdersListResponseDTO } from "../dto/OrdersListResponseDTO";

export interface IGetAllOrdersUseCase {
  execute(
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    userId?: string
  ): Promise<OrdersListResponseDTO>;
}
