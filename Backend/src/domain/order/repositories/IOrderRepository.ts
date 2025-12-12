import { IOrder } from "../entitiy/IOrder";

export interface IOrderRepository {
  createOrder(
    data: Omit<IOrder, "id" | "createdAt" | "updatedAt">
  ): Promise<IOrder>;
  findOrderById(orderId: string): Promise<IOrder | null>;
  findAllOrders(guestId: string): Promise<IOrder[]>;
  updateOrder(
    guestId: string,
    data: Omit<IOrder, "id" | "createdAt" | "updatedAt">
  ): Promise<IOrder>;
}
