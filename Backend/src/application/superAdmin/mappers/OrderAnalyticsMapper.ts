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
    revenueTimeline: RevenueTimelineEntry[]
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
      },
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

  static toOrderDetails(order: IOrderDetail): OrderDetailsResponseDTO {
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
      paymentId: order.paymentId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      guest: order.guest
        ? {
          id: order.guest.id,
          name: order.guest.name,
          phone: order.guest.phone,
          email: order.guest.email,
        }
        : undefined,
      address: order.address
        ? {
          fullName: order.address.fullName,
          street: order.address.street,
          city: order.address.city,
          state: order.address.state,
          zipCode: order.address.zipCode,
          phone: order.address.phone,
        }
        : undefined,
      prescription: order.prescription
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
        : undefined,
    };
  }
}
