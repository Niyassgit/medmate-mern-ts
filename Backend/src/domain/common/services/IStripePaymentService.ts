import { ICheckoutDetails } from "../../subscription/entities/ICheckoutDetails";

export interface IStripePaymentService {
  createCheckoutSession(
    repId: string,
    planId: string,
    price: number
  ): Promise<string | null>;
  getCheckoutDetails(sessionId:string):Promise<ICheckoutDetails>
}
