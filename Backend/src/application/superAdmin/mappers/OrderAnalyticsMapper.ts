import { IOrder } from "../../../domain/order/entitiy/IOrder";
import { OrderAnalyticsDTO } from "../dto/OrderAnalyticsDTO";
import { UpdateOrderStatusResponseDTO } from "../dto/UpdateOrderStatusResponseDTO";
import { RevenueTimelineEntry } from "../utils/RevenuePeriodUtil";
import { IOrderDetail } from "../../../domain/order/entitiy/IOrderDetail";
import { OrderDetailsResponseDTO } from "../dto/OrderDetailsResponseDTO";

export class OrderAnalyticsMapper {
  static todomain(
    totalPrescriptions: number,
    paidOrders: number,
    grossAmount: number,
    doctorEarnings: number,
    unpaidPrescriptions: number,
    adminEarnings: number,
    revenueTimeline: RevenueTimelineEntry[],
    salesByCompany: { name: string; value: number }[],
    topDoctors: { name: string; value: number }[],
    recentOrders: (IOrder | IOrderDetail)[]
  ): OrderAnalyticsDTO {
    return {
      summary: {
        totalPrescriptions,
        paidOrders,
        grossAmount,
        doctorEarnings,
        adminEarnings,
      },
      charts: {
        revenueOverTime: revenueTimeline.map((entry) => ({
          date: entry.period,
          amount: Number(entry.amount.toFixed(2)),
        })),
        paidVsUnpaid: {
          paid: paidOrders,
          unpaid: unpaidPrescriptions,
        },
        earningsSplit: {
          doctor: doctorEarnings,
          admin: adminEarnings,
        },
        salesByCompany,
        topDoctors,
      },
      recentOrders: recentOrders.map(order => this.toOrderDetails(order)),
    };
  }

  static toOrderUpdate(data: IOrder): UpdateOrderStatusResponseDTO {
    return {
      id: data.id,
      orderId: data.id,
      status: data.status,
      paymentStatus: data.paymentStatus,
      updatedAt: data.updatedAt,
    };
  }

  static toOrderDetails(order: IOrderDetail | IOrder): OrderDetailsResponseDTO {
    const isDetailedOrder = (obj: unknown): obj is IOrderDetail => {
      return obj !== null && typeof obj === "object" && "guest" in obj && (obj as Record<string, unknown>).guest !== undefined;
    };

    const hasGuestName = (obj: unknown): obj is { guestName: string } => {
      return obj !== null && typeof obj === "object" && "guestName" in obj;
    };

    const hasDoctorName = (obj: unknown): obj is { doctorName: string; hospital?: string } => {
      return obj !== null && typeof obj === "object" && "doctorName" in obj;
    };

    const guestData = isDetailedOrder(order)
      ? {
        id: order.guest.id,
        name: order.guest.name,
        phone: order.guest.phone,
        email: order.guest.email,
      }
      : hasGuestName(order)
        ? { id: "", name: order.guestName, phone: "", email: "" }
        : undefined;

    const prescriptionData = isDetailedOrder(order) && order.prescription
      ? {
        id: order.prescription.id,
        doctor: order.prescription.doctor
          ? {
            name: order.prescription.doctor.name,
            hospital: order.prescription.doctor.hospital || "",
          }
          : undefined,
        items: order.prescription.items?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            name: item.product.name,
            brand: item.product.brand,
            mrp: item.product.mrp,
          },
        })),
      }
      : hasDoctorName(order)
        ? {
          id: "",
          doctor: {
            name: order.doctorName,
            hospital: order.hospital || ""
          }
        }
        : undefined;

    return {
      id: order.id,
      orderId: order.id,
      guestId: order.guestId,
      prescriptionId: order.prescriptionId,
      addressId: order.addressId,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryAddress: order.deliveryAddress,
      paymentId: order.paymentId || null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      guest: guestData,
      address: isDetailedOrder(order) && order.address
        ? {
          fullName: order.address.fullName,
          street: order.address.street,
          city: order.address.city,
          state: order.address.state,
          zipCode: order.address.zipCode,
          phone: order.address.phone,
        }
        : undefined,
      prescription: prescriptionData,
    };
  }
}
