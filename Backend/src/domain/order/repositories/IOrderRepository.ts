import { IOrder } from "../entitiy/IOrder";
import { IOrderDetail } from "../entitiy/IOrderDetail";

import { DoctorEarningsDTO } from "../../../application/superAdmin/dto/DoctorEarningsDTO";
import { AdminEarningsDTO } from "../../../application/superAdmin/dto/AdminEarningsDTO";

export interface IOrderRepository {
  getDoctorEarningsList(
    page: number,
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<DoctorEarningsDTO[]>;

  getAdminEarningsList(
    page: number,
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<AdminEarningsDTO[]>;

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
  countPaidOrders(start?: Date, end?: Date): Promise<number>;
  sumGrossAmount(start?: Date, end?: Date): Promise<number>;

  sumDoctorEarnings(start?: Date, end?: Date): Promise<number>;
  sumAdminEarnings(start?: Date, end?: Date): Promise<number>;
  revenueTimeline(
    start?: Date,
    end?: Date
  ): Promise<{ createdAt: Date; totalAmount: number }[]>;
}
