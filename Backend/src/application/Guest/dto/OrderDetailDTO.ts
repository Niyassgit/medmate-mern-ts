import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface OrderDetailDTO {
    id: string;
    createdAt: string; // ISO string
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    paymentId: string;
    guest: {
        name: string;
        email: string;
        phone: string;
    };
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    prescription: {
        id: string;
        caretedAt: string;
        doctor: {
            name: string;
            specialization: string;
            hospital?: string;
        };
    };
    items: {
        name: string;
        quantity: number;
        image?: string;
        price?: number; // Optional if we have unit price
    }[];
}
