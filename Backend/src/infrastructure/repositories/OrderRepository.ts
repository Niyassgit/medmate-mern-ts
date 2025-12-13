import { Order, Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { IOrder } from "../../domain/order/entitiy/IOrder";
import { IOrderRepository } from "../../domain/order/repositories/IOrderRepository";
import { BaseRepository } from "../database/BaseRepository";
import { OrderMapper } from "../mappers/OrderMapper";
import { NotFoundError } from "../../domain/common/errors";
import { ErrorMessages } from "../../shared/Messages";

export class OrderRepository
    extends BaseRepository<
        IOrder,
        Order,
        Prisma.OrderCreateInput,
        "order"
    >
    implements IOrderRepository {
    constructor() {
        super(prisma.order, (o: Order) => OrderMapper.toDomain(o));
    }

    async createOrder(
        data: Omit<IOrder, "id" | "createdAt" | "updatedAt">
    ): Promise<IOrder> {
        const mappedData = OrderMapper.toPersistance(data);
        return await this.create(mappedData);
    }

    async findOrderById(orderId: string): Promise<IOrder | null> {
        return await this.findById(orderId);
    }

    async findAllOrders(guestId: string): Promise<IOrder[]> {
        const orders = await prisma.order.findMany({
            where: { guestId },
            include: {
                prescription: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
        return orders.map((o) => OrderMapper.toDomain(o));
    }

    async updateOrder(
        orderId: string,
        data: Partial<Omit<IOrder, "id" | "createdAt" | "updatedAt">>
    ): Promise<IOrder> {
        const exist = await this.findById(orderId);
        if (!exist) throw new NotFoundError(ErrorMessages.ORDER_NOT_FOUND || "Order not found"); // Need to check if message exists

        const mappedData = OrderMapper.toUpdatePersistance(data);
        const updated = await prisma.order.update({
            where: { id: orderId },
            data: mappedData,
        });
        return OrderMapper.toDomain(updated);
    }
}
