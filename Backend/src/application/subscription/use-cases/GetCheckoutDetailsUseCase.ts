import { IStripePaymentService } from "../../../domain/common/services/IStripePaymentService";
import { CheckoutDetailsDTO } from "../dto/CheckoutDetailsDTO";
import { IGetCheckoutDetailsUseCase } from "../interfaces/IGetCheckoutDetailsUseCase";

export class GetCheckoutDetailsUseCase implements IGetCheckoutDetailsUseCase{
    constructor(
        private _stripeService:IStripePaymentService
    ){}
   async execute(sessionId: string): Promise<CheckoutDetailsDTO> {
       return await this._stripeService.getCheckoutDetails(sessionId);
   }
}