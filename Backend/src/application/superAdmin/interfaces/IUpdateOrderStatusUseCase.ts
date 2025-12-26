import { OrderStatus } from "../../../shared/Enums";
import { UpdateOrderStatusResponseDTO } from "../dto/UpdateOrderStatusResponseDTO";

export interface IUpdateOrderStatusUseCase {
    execute(orderId: string, status: OrderStatus): Promise<UpdateOrderStatusResponseDTO>;
}
