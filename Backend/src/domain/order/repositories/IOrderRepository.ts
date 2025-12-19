import { IOrder } from "../entitiy/IOrder";
import { IOrderDetail } from "../entitiy/IOrderDetail";

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
  findOrderDetailsById(orderId: string): Promise<IOrderDetail | null>;
  findOrdersByRepId(repId: string): Promise<IOrder[]>;
  getRepAnalytics(
    repId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<IOrder[]>;
}
