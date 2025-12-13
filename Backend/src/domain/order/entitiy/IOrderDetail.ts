import { PaymentStatus, OrderStatus } from "../../../shared/Enums";

export interface IOrderDetail {
    id: string;
    createdAt: Date;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    paymentId: string | null;
    guestId: string;
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
        createdAt: Date;
        doctor: {
            specialization: string;
            hospital: string | null;
            user: {
                name: string;
            };
        };
        items: {
            quantity: number;
            product: {
                name: string;
                imageUrl: string[];
            };
        }[];
    } | null;
}
