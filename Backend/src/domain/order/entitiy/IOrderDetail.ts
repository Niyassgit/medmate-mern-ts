import { PaymentStatus, OrderStatus } from "../../../shared/Enums";

export interface IOrderDetail {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    paymentId: string | null;
    guestId: string;
    prescriptionId: string;
    addressId: string;
    deliveryAddress: string;
    guest: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    address: {
        id: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        fullName: string;
        phone: string;
    };
    prescription: {
        id: string;
        createdAt: Date;
        doctor: {
            id: string;
            name: string;
            hospital: string | null;
            department: {
                name: string;
            } | null;
        } | null;
        items: {
            id: string;
            quantity: number;
            product: {
                id: string;
                name: string;
                imageUrl: string[];
                repId: string;
                ptr: number;
                mrp: number;
                brand: string;
            };
        }[];
    } | null;
}
