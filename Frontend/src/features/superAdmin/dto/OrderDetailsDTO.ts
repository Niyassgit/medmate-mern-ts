
import { OrderStatus, PaymentStatus } from "@/features/superAdmin/dto/OrderTableDTO";

export interface IOrderDetailsDTO {
    id: string;
    orderId: string; // The prescription ID is often used as order ID in this system, or the order's own ID
    guestId: string;
    prescriptionId: string;
    addressId: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    deliveryAddress: string;
    paymentId: string | null;
    createdAt: string;
    updatedAt: string;
    guest?: {
        id: string;
        name: string;
        phone: string;
        email: string;
    };
    address?: {
        fullName: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
    };
    prescription?: {
        doctor?: {
            name: string;
            hospital: string;
        };
        items?: {
            id: string;
            quantity: number;
            product: {
                name: string;
                brand: string;
                mrp: number;
            };
        }[];
    };
}
