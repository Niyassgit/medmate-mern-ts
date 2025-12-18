export interface IOrderPaymentDetails {
    orderId: string;
    prescriptionId: string;
    guestId: string;
    customerEmail?: string;
    items: Array<{
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }>;
}
