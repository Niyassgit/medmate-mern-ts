import { Order, Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { IOrder } from "../../domain/order/entitiy/IOrder";
import { IOrderRepository } from "../../domain/order/repositories/IOrderRepository";
import { BaseRepository } from "../database/BaseRepository";
import { OrderMapper } from "../mappers/OrderMapper";
import { NotFoundError } from "../../domain/common/errors";
import { ErrorMessages } from "../../shared/Messages";
import { IOrderDetail } from "../../domain/order/entitiy/IOrderDetail";
import { PaymentStatus } from "../../shared/Enums";

export class OrderRepository
  extends BaseRepository<IOrder, Order, Prisma.OrderCreateInput, "order">
  implements IOrderRepository
{
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
                product: true,
              },
            },
          },
        },
      },
    });
    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async findOrderDetailsById(orderId: string): Promise<IOrderDetail | null> {
    return (await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        address: true,
        guest: true,
        prescription: {
          include: {
            doctor: {
              include: {
                department: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })) as unknown as IOrderDetail | null;
  }

  async updateOrder(
    orderId: string,
    data: Partial<Omit<IOrder, "id" | "createdAt" | "updatedAt">>
  ): Promise<IOrder> {
    const exist = await this.findById(orderId);
    if (!exist)
      throw new NotFoundError(
        ErrorMessages.ORDER_NOT_FOUND || "Order not found"
      );

    const mappedData = OrderMapper.toUpdatePersistance(data);
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: mappedData,
    });
    return OrderMapper.toDomain(updated);
  }
  async findOrdersByRepId(repId: string): Promise<IOrder[]> {
    const orders = await prisma.order.findMany({
      where: {
        prescription: {
          items: {
            some: {
              product: {
                repId: repId,
              },
            },
          },
        },
      },
      include: {
        prescription: {
          include: {
            doctor: {
              include: {
                department: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        guest: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async getRepAnalytics(
    repId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<IOrder[]> {
    const whereClause: Prisma.OrderWhereInput = {
      prescription: {
        items: {
          some: {
            product: {
              repId: repId,
            },
          },
        },
      },
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        prescription: {
          include: {
            doctor: {
              include: {
                department: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        guest: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return orders.map((o) => OrderMapper.toDomain(o));
  }

  async countPaidOrders(start?: Date, end?: Date): Promise<number> {
    const whereClause: Prisma.OrderWhereInput = {
      paymentStatus: PaymentStatus.SUCCESS,
    };

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    return await prisma.order.count({
      where: whereClause,
    });
  }

  async countPrescriptions(start?: Date, end?: Date): Promise<number> {
    const whereClause: Prisma.OrderWhereInput = {};

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        prescriptionId: true,
      },
    });

    // Count distinct prescriptions
    const uniquePrescriptionIds = new Set(
      orders.map((order) => order.prescriptionId)
    );
    return uniquePrescriptionIds.size;
  }

  async revenueTimeline(
    start?: Date,
    end?: Date
  ): Promise<{ createdAt: Date; totalAmount: number }[]> {
    const whereClause: Prisma.OrderWhereInput = {
      paymentStatus: PaymentStatus.SUCCESS,
    };

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        totalAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return orders.map((order) => ({
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
    }));
  }

  async sumAdminEarnings(start?: Date, end?: Date): Promise<number> {
    const whereClause: Prisma.CommissionWhereInput = {};

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        whereClause.createdAt.gte = startDate;
      }
      if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = endDate;
      }
    }

    const result = await prisma.commission.aggregate({
      where: whereClause,
      _sum: {
        adminCut: true,
      },
    });

    return Number((result._sum.adminCut || 0).toFixed(2));
  }

  async sumDoctorEarnings(start?: Date, end?: Date): Promise<number> {
    const whereClause: Prisma.CommissionWhereInput = {};

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        whereClause.createdAt.gte = startDate;
      }
      if (end) {

        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = endDate;
      }
    }

    const result = await prisma.commission.aggregate({
      where: whereClause,
      _sum: {
        doctorCut: true,
      },
    });

    return Number((result._sum.doctorCut || 0).toFixed(2));
  }

  async sumGrossAmount(start?: Date, end?: Date): Promise<number> {
    const whereClause: Prisma.OrderWhereInput = {
      paymentStatus: PaymentStatus.SUCCESS,
    };

    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    const result = await prisma.order.aggregate({
      where: whereClause,
      _sum: {
        totalAmount: true,
      },
    });

    return Number((result._sum.totalAmount || 0).toFixed(2));
  }
}
