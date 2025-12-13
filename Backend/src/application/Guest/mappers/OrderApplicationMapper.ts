import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { OrderStatus, PaymentStatus } from "../../../shared/Enums";
import { ICreateOrderData } from "../dto/ICreateOrderData";
import { OrderDTO } from "../dto/OrderDTO";


export class OrderApplicationMapper {
    static toPersistence(data: ICreateOrderData) {
        return {
            guestId: data.guestId,
            prescriptionId: data.prescriptionId,
            addressId: data.addressId,
            totalAmount: data.totalAmount,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            deliveryAddress: data.deliveryAddress || "Fetched from Address ID",
            paymentId: data.paymentId || "",
        };
    }

    static async toDomain(data: IOrder, storageService: IStorageService): Promise<OrderDTO> {
        const itemsWithSignedUrls = data.items
            ? await Promise.all(
                data.items.map(async (item) => ({
                    ...item,
                    image: item.image
                        ? await storageService.generateSignedUrl(item.image)
                        : undefined,
                }))
            )
            : [];

        return {
            id: data.id,
            paymentStatus: data.paymentStatus as PaymentStatus,
            createdAt: data.createdAt,
            guestId: data.guestId,
            paymentId: data.paymentId,
            prescriptionId: data.prescriptionId,
            status: data.status,
            totalAmount: data.totalAmount,
            items: itemsWithSignedUrls,
        };
    }
}
