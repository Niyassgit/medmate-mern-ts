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

  countPrescriptions(start?: Date, end?: Date): Promise<number>;
  // Orders
  countPaidOrders(start?: Date, end?: Date): Promise<number>;
  sumGrossAmount(start?: Date, end?: Date): Promise<number>;

  // Commission
  sumDoctorEarnings(start?: Date, end?: Date): Promise<number>;
  sumAdminEarnings(start?: Date, end?: Date): Promise<number>;

  // Charts
  revenueTimeline(
    start?: Date,
    end?: Date
  ): Promise<{ createdAt: Date; totalAmount: number }[]>;
}
