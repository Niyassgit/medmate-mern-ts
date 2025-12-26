
import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface OrderDetailsResponseDTO {
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
    createdAt: Date;
    updatedAt: Date;
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
        id: string;
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
