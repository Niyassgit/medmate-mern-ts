import { OrderDetailDTO } from "../dto/OrderDetailDTO";

export interface IGetOrderDetailUseCase {
    execute(orderId: string, userId?: string): Promise<OrderDetailDTO>;
}
