import { OrderDTO } from "../dto/OrderDTO";

export interface IGetOrdersUseCase {
  execute(userId?: string): Promise<OrderDTO[]>;
}
