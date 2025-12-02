import { CheckoutDetailsDTO } from "../dto/CheckoutDetailsDTO";

export interface IGetCheckoutDetailsUseCase{
    execute(sessionId:string):Promise<CheckoutDetailsDTO>;
}