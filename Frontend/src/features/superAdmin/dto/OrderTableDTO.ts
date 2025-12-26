
export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export interface OrderTableDTO {
    orderId: string;
    doctorName: string;
    createdAt: string;
    orderStatus: OrderStatus;
    totalAmount: string;
    payementStatus: PaymentStatus;
}

export interface OrdersListResponseDTO {
    orders: OrderTableDTO[];
    total: number;
}
