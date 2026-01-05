
import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface UpdateOrderStatusResponseDTO {
    id: string;
    orderId: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    updatedAt: Date;
}
