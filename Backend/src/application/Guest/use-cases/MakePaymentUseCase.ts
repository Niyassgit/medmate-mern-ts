import { IStripePaymentService } from "../../../domain/common/services/IStripePaymentService";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { IMakePaymentUseCase } from "../interefaces/IMakePaymentUseCase";
import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { ErrorMessages } from "../../../shared/Messages";
import { OrderUtils } from "../utils/OrderUtils";
import { OrderApplicationMapper } from "../mappers/OrderApplicationMapper";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { PaymentStatus } from "../../../shared/Enums";

export class MakePaymentUseCase implements IMakePaymentUseCase {
  constructor(
    private _orderRepository: IOrderRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _stripePaymentService: IStripePaymentService,
    private _guestRepository: IGuestRepository
  ) { }

  async execute(
    prescriptionId: string,
    addressId: string,
    paymentMethod: string,
    userId?: string
  ): Promise<string | null> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const guest = await this._guestRepository.findGuestByuserId(userId);
    if (!guest) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const prescription =
      await this._prescriptionRepository.findPrescriptionByIdWithItems(
        prescriptionId
      );

    if (!prescription)
      throw new BadRequestError(ErrorMessages.PRESCRIPTION_NOT_FOUND);

    const { totalAmount, paymentItems } =
      OrderUtils.calculateOrderDetails(prescription);

    if (prescription.order) {
      const existingOrder = prescription.order;
      if (existingOrder.paymentStatus === PaymentStatus.SUCCESS) {
        throw new BadRequestError(ErrorMessages.ALREADY_PAID);
      }

      const sessionUrl =
        await this._stripePaymentService.createOrderCheckoutSession({
          orderId: existingOrder.id,
          items: paymentItems,
          prescriptionId,
          guestId: guest.id,
          customerEmail: guest.email ?? "",
        });
      return sessionUrl;
    }

    const orderData = OrderApplicationMapper.toPersistence({
      guestId: guest.id,
      prescriptionId,
      addressId,
      totalAmount,
      deliveryAddress: "Fetched from Address ID",
      paymentId: "",
    });

    const order = await this._orderRepository.createOrder(orderData);

    if (paymentMethod === "upi") {
      // Handle COD logic - return simple success URL or order ID
      // For now returning null as specific requirement was for payment integration
      return null;
    }

    const sessionUrl =
      await this._stripePaymentService.createOrderCheckoutSession({
        orderId: order.id,
        items: paymentItems,
        prescriptionId,
        guestId: guest.id,
        customerEmail: guest.email ?? "",
      });

    return sessionUrl;
  }
}
