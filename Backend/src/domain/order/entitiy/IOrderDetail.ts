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
            name: string;
            hospital: string | null;
            department: {
                name: string;
            } | null;
        };
        items: {
            quantity: number;
            product: {
                name: string;
                imageUrl: string[];
                repId: string;
            };
        }[];
    } | null;
}
