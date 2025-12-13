import { Order, Prisma } from "@prisma/client";
import { IOrder } from "../../domain/order/entitiy/IOrder";
import { OrderStatus, PaymentStatus } from "../../shared/Enums";

export class OrderMapper {
    static toDomain(data: Order & {
        prescription?: {
            items: {
                quantity: number;
                product: {
                    name: string;
                    imageUrl: string[];
                }
            }[]
        } | null
    }): IOrder {
        return {
            id: data.id,
            guestId: data.guestId,
            prescriptionId: data.prescriptionId,
            addressId: data.addressId,
            totalAmount: data.totalAmount,
            status: data.status as OrderStatus,
            paymentStatus: data.paymentStatus as PaymentStatus,
            deliveryAddress: data.deliveryAddress,
            paymentId: data.paymentId || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            items: data.prescription?.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                image: item.product.imageUrl[0]
            }))
        };
    }

    static toPersistance(
        data: Omit<IOrder, "id" | "createdAt" | "updatedAt">
    ): Prisma.OrderCreateInput {
        return {
            guest: { connect: { id: data.guestId } },
            prescription: { connect: { id: data.prescriptionId } },
            address: { connect: { id: data.addressId } },
            totalAmount: data.totalAmount,
            status: data.status,
            paymentStatus: data.paymentStatus,
            deliveryAddress: data.deliveryAddress,
            paymentId: data.paymentId || null,
        };
    }

    static toUpdatePersistance(
        data: Partial<Omit<IOrder, "id" | "createdAt" | "updatedAt">>
    ): Prisma.OrderUpdateInput {
        const updateData: Prisma.OrderUpdateInput = {};

        if (data.guestId) updateData.guest = { connect: { id: data.guestId } };
        if (data.prescriptionId)
            updateData.prescription = { connect: { id: data.prescriptionId } };
        if (data.addressId)
            updateData.address = { connect: { id: data.addressId } };
        if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount;
        if (data.status) updateData.status = data.status;
        if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
        if (data.deliveryAddress) updateData.deliveryAddress = data.deliveryAddress;
        if (data.paymentId !== undefined) updateData.paymentId = data.paymentId || null;

        return updateData;
    }
}
