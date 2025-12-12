import { OrderStatus, StripePaymentStatus } from "../../../shared/Enums";
import { ICreateOrderData } from "../dto/ICreateOrderData";



export class OrderApplicationMapper {
    static toPersistence(data: ICreateOrderData) {
        return {
            guestId: data.guestId,
            prescriptionId: data.prescriptionId,
            addressId: data.addressId,
            totalAmount: data.totalAmount,
            status: OrderStatus.PENDING,
            paymentStatus: StripePaymentStatus.UNPAID,
            deliveryAddress: data.deliveryAddress || "Fetched from Address ID",
            paymentId: data.paymentId || "",
        };
    }
}
