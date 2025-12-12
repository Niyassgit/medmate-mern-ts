import { Order, Prisma } from "@prisma/client";
import { IOrder } from "../../domain/order/entitiy/IOrder";
import { OrderStatus, StripePaymentStatus } from "../../shared/Enums";

export class OrderMapper {
    static toDomain(data: Order): IOrder {
        const mapPaymentStatus = (status: string): StripePaymentStatus => {
            switch (status) {
                case "PENDING": return StripePaymentStatus.UNPAID;
                case "SUCCESS": return StripePaymentStatus.PAID;
                case "FAILED": return StripePaymentStatus.UNPAID;
                default: return StripePaymentStatus.UNPAID;
            }
        };

        return {
            id: data.id,
            guestId: data.guestId,
            prescriptionId: data.prescriptionId,
            addressId: data.addressId,
            totalAmount: data.totalAmount,
            status: data.status as OrderStatus,
            paymentStatus: mapPaymentStatus(data.paymentStatus),
            deliveryAddress: data.deliveryAddress,
            paymentId: data.paymentId || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    static toPersistance(
        data: Omit<IOrder, "id" | "createdAt" | "updatedAt">
    ): Prisma.OrderCreateInput {
        const mapPaymentStatus = (status: StripePaymentStatus): "PENDING" | "SUCCESS" | "FAILED" => {
            if (status === StripePaymentStatus.PAID) return "SUCCESS";
            if (status === StripePaymentStatus.UNPAID) return "PENDING";
            return "PENDING";
        }

        return {
            guest: { connect: { id: data.guestId } },
            prescription: { connect: { id: data.prescriptionId } },
            address: { connect: { id: data.addressId } },
            totalAmount: data.totalAmount,
            status: data.status,
            paymentStatus: mapPaymentStatus(data.paymentStatus),
            deliveryAddress: data.deliveryAddress,
            paymentId: data.paymentId || null,
        };
    }

    static toUpdatePersistance(
        data: Partial<Omit<IOrder, "id" | "createdAt" | "updatedAt">>
    ): Prisma.OrderUpdateInput {
        const updateData: Prisma.OrderUpdateInput = {};

        const mapPaymentStatus = (status: StripePaymentStatus): "PENDING" | "SUCCESS" | "FAILED" => {
            if (status === StripePaymentStatus.PAID) return "SUCCESS";
            if (status === StripePaymentStatus.UNPAID) return "PENDING";
            return "PENDING";
        }

        if (data.guestId) updateData.guest = { connect: { id: data.guestId } };
        if (data.prescriptionId)
            updateData.prescription = { connect: { id: data.prescriptionId } };
        if (data.addressId)
            updateData.address = { connect: { id: data.addressId } };
        if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount;
        if (data.status) updateData.status = data.status;
        if (data.paymentStatus) updateData.paymentStatus = mapPaymentStatus(data.paymentStatus);
        if (data.deliveryAddress) updateData.deliveryAddress = data.deliveryAddress;
        if (data.paymentId !== undefined) updateData.paymentId = data.paymentId || null;

        return updateData;
    }
}
