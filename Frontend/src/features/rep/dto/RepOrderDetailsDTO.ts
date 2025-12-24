import { OrderStatus } from "@/types/PaymentTypes";

export interface IRepOrderDetails {
    id: string;
    createdAt: string;
    status: OrderStatus;
    paymentStatus: OrderStatus;
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
        createdAt: string;
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
        price?: number;
    }[];
}
