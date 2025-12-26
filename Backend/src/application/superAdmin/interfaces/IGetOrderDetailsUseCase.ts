
import { IOrderDetail } from "../../../domain/order/entitiy/IOrderDetail";

export interface IGetOrderDetailsUseCase {
    execute(orderId: string): Promise<IOrderDetail | null>;
}
