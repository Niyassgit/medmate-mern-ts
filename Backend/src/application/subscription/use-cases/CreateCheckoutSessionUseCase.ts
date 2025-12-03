import { BadRequestError } from "../../../domain/common/errors";
import { IStripePaymentService } from "../../../domain/common/services/IStripePaymentService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ICreateCheckoutSessionUseCase } from "../interfaces/ICreateCheckoutSessionUseCase";

export class CreateCheckoutSessionUseCase
  implements ICreateCheckoutSessionUseCase
{
  constructor(
    private _subscriptionRepository: ISubscriptionRepositoy,
    private _payementService: IStripePaymentService,
    private _medicalRepRepository: IMedicalRepRepository
  ) {}
  async execute(userId: string, planId: string): Promise<string> {
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const plan = await this._subscriptionRepository.findSubscriptionById(
      planId
    );
    if (!plan) throw new BadRequestError(ErrorMessages.SUB_NOT_FOUND);
    const url = await this._payementService.createCheckoutSession(
      repId,
       plan,
      plan.price
    );
    if (!url) throw new BadRequestError(ErrorMessages.SUB_ATTEMPT_FAILED);
    return url;
  }
}
