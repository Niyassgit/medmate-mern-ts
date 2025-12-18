import { OrderDetailDTO } from "../../Guest/dto/OrderDetailDTO";


export interface IGetOrderDetailsUseCase {
    execute(orderId: string, userId?: string): Promise<OrderDetailDTO>;
}
