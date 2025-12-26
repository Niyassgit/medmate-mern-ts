
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IGetOrderDetailsUseCase } from "../interfaces/IGetOrderDetailsUseCase";
import { OrderDetailsResponseDTO } from "../dto/OrderDetailsResponseDTO";

export class GetOrderDetailsUseCase implements IGetOrderDetailsUseCase {
    constructor(private _orderRepository: IOrderRepository) { }

    async execute(orderId: string): Promise<OrderDetailsResponseDTO | null> {
        const order = await this._orderRepository.findOrderDetailsById(orderId);
        if (!order) return null;

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
