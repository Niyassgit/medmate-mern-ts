import { IOrderCheckoutDetails } from "../../order/entitiy/IOrderCheckoutDetails";
import { ICheckoutDetails } from "../../subscription/entities/ICheckoutDetails";
import { ISubscription } from "../../subscription/entities/ISubscription";
import { IOrderPaymentDetails } from "../../order/entitiy/IOrderPaymentDetails";

export interface IStripePaymentService {
  createCheckoutSession(
    repId: string,
    plan: ISubscription,
    price: number
  ): Promise<string | null>;
  getCheckoutDetails(sessionId: string): Promise<ICheckoutDetails>;
  createOrderCheckoutSession(
    paymentDetails: IOrderPaymentDetails
  ): Promise<string | null>;

  getOrderCheckoutDetails(sessionId: string): Promise<IOrderCheckoutDetails>;
}
