import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { OrderStatus, PaymentStatus } from "../../../shared/Enums";
import { ICreateOrderData } from "../dto/ICreateOrderData";
import { OrderDTO } from "../dto/OrderDTO";
import { OrderDetailDTO } from "../dto/OrderDetailDTO";
import { IOrderDetail } from "../../../domain/order/entitiy/IOrderDetail";


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
    static async toDetailDomain(data: IOrderDetail, storageService: IStorageService): Promise<OrderDetailDTO> {
        const itemsWithSignedUrls = data.prescription?.items
            ? await Promise.all(
                data.prescription.items.map(async (item: any) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    image: item.product.imageUrl[0]
                        ? await storageService.generateSignedUrl(item.product.imageUrl[0])
                        : undefined,
                }))
            )
            : [];

        return {
            id: data.id,
            createdAt: data.createdAt.toISOString(),
            status: data.status,
            paymentStatus: data.paymentStatus,
            totalAmount: data.totalAmount,
            paymentId: data.paymentId || "",
            guest: {
                name: data.guest.name,
                email: data.guest.email,
                phone: data.guest.phone,
            },
            address: {
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                zip: data.address.zip,
                country: data.address.country,
            },
            prescription: {
                id: data.prescription?.id || "",
                caretedAt: data.prescription?.createdAt.toISOString() || "",
                doctor: {
                    name: data.prescription?.doctor.user.name || "",
                    specialization: data.prescription?.doctor.specialization || "",
                    hospital: data.prescription?.doctor.hospital || undefined,
                },
            },
            items: itemsWithSignedUrls,
        };
    }
}
