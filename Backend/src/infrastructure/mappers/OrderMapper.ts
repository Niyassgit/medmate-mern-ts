import { Order, Prisma } from "@prisma/client";
import { IOrder } from "../../domain/order/entitiy/IOrder";
import { OrderStatus, PaymentStatus } from "../../shared/Enums";
import { DoctorEarningsDTO } from "../../application/superAdmin/dto/DoctorEarningsDTO";
import { AdminEarningsDTO } from "../../application/superAdmin/dto/AdminEarningsDTO";
import { OrderTableDTO } from "../../application/superAdmin/dto/OrderTableDTO";

interface DoctorWithDetails {
  id: string;
  name: string;
  user: { email: string } | null;
  department: { name: string } | null;
}

export class OrderMapper {
  static toDomain(
    data: Order & {
      prescription?: {
        doctor?: {
          name: string;
          hospital: string;
        };
        items: {
          quantity: number;
          product: {
            id: string;
            name: string;
            imageUrl: string[];
            ptr: number;
            repId: string;
          };
        }[];
      } | null;
    }
  ): IOrder {
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
      doctorName: data.prescription?.doctor?.name,
      hospital: data.prescription?.doctor?.hospital,
      items: data.prescription?.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.imageUrl[0],
        ptr: item.product.ptr,
        repId: String(item.product.repId),
      })),
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
    if (data.totalAmount !== undefined)
      updateData.totalAmount = data.totalAmount;
    if (data.status) updateData.status = data.status;
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
    if (data.deliveryAddress) updateData.deliveryAddress = data.deliveryAddress;
    if (data.paymentId !== undefined)
      updateData.paymentId = data.paymentId || null;

    return updateData;
  }

  static toDoctorEarningsDTO(
    doctor: DoctorWithDetails,
    totalPrescriptions: number,
    paidOrders: number,
    grossSales: number,
    totalCommission: number
  ): DoctorEarningsDTO {
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      email: doctor.user?.email || "N/A",
      department: doctor.department?.name || "N/A",
      totalPrescriptions,
      paidOrders,
      grossSales,
      totalCommission,
    };
  }

  static toAdminEarningsDTO(
    doctor: DoctorWithDetails,
    totalPrescriptions: number,
    paidOrders: number,
    grossSales: number,
    adminEarnings: number
  ): AdminEarningsDTO {
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      email: doctor.user?.email || "N/A",
      department: doctor.department?.name || "N/A",
      totalPrescriptions,
      paidOrders,
      grossSales,
      adminEarnings,
    };
  }

  static toTableDTO(order: IOrder): OrderTableDTO {
    return {
      orderId: order.id,
      doctorName: order.doctorName || "N/A",
      createdAt: order.createdAt.toISOString(),
      orderStatus: order.status,
      totalAmount: String(order.totalAmount),
      payementStatus: order.paymentStatus,
    };
  }
}
