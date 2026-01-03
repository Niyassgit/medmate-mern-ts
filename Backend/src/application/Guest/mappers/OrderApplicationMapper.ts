import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { OrderStatus, PaymentStatus } from "../../../shared/Enums";
import { ICreateOrderData } from "../dto/ICreateOrderData";
import { OrderDTO } from "../dto/OrderDTO";
import { OrderDetailDTO } from "../dto/OrderDetailDTO";
import { IOrderDetail } from "../../../domain/order/entitiy/IOrderDetail";

type PrescriptionItem = {
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
};


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
            paymentStatus: data.paymentStatus,
            createdAt: data.createdAt,
            guestId: data.guestId,
            paymentId: data.paymentId,
            prescriptionId: data.prescriptionId,
            status: data.status,
            totalAmount: data.totalAmount,
            items: itemsWithSignedUrls,
        };
    }
    static async toDetailDomain(data: IOrderDetail, storageService: IStorageService, repId?: string): Promise<OrderDetailDTO> {
        let items: PrescriptionItem[] = data.prescription?.items || [];
        let totalAmount = data.totalAmount;

        if (repId) {
            items = items.filter((item) => String(item.product.repId) === String(repId));
            totalAmount = items.reduce((sum, item) => sum + ((item.product.ptr || 0) * item.quantity), 0);
        }

        const itemsWithSignedUrls = items.length > 0
            ? await Promise.all(
                items.map(async (item) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    image: item.product.imageUrl && item.product.imageUrl[0]
                        ? await storageService.generateSignedUrl(item.product.imageUrl[0])
                        : undefined,
                    price: item.product.ptr
                }))
            )
            : [];

        return {
            id: data.id,
            createdAt: data.createdAt.toISOString(),
            status: data.status,
            paymentStatus: data.paymentStatus,
            totalAmount: totalAmount,
            paymentId: data.paymentId || "",
            guest: {
                name: data.guest.name,
                email: data.guest.email,
                phone: data.guest.phone,
            },
            address: {
                id: data.address.id || "",
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                zip: data.address.zipCode,
                country: data.address.country,
            },
            prescription: {
                id: data.prescription?.id || "",
                createdAt: data.prescription?.createdAt.toISOString() || "",
                doctor: {
                    name: data.prescription?.doctor?.name || "Unknown",
                    specialization: data.prescription?.doctor?.department?.name || "General",
                    hospital: data.prescription?.doctor?.hospital || undefined,
                },
            },
            items: itemsWithSignedUrls,
        };
    }
}
