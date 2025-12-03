import { ICheckoutDetails } from "../../subscription/entities/ICheckoutDetails";
import { ISubscription } from "../../subscription/entities/ISubscription";

export interface IStripePaymentService {
  createCheckoutSession(
    repId: string,
    plan: ISubscription,
    price: number
  ): Promise<string | null>;
  getCheckoutDetails(sessionId:string):Promise<ICheckoutDetails>
}
