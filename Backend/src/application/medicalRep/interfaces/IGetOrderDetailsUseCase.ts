import { OrderDetailDTO } from "../../guest/dto/OrderDetailDTO";


export interface IGetOrderDetailsUseCase {
    execute(orderId: string, userId?: string): Promise<OrderDetailDTO>;
}
