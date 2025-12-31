import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStripePaymentService } from "../../../domain/common/services/IStripePaymentService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ProrationDetailsDTO } from "../dto/ProrationDetailsDTO";
import { IUpgradeSubscriptionPlanUseCase } from "../interfaces/IUpgradeSubscriptionPlanUseCase";

export class UpgradeSubscriptionPlanUseCase
  implements IUpgradeSubscriptionPlanUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _paymentService: IStripePaymentService
  ) {}

  async execute(
    newPlanId: string,
    userId?: string
  ): Promise<{ checkoutUrl: string; prorationDetails: ProrationDetailsDTO }> {
    if (!userId) {
      throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    }

    const medicalRep =
      await this._medicalRepRepository.getMedicalRepByUserId(userId);

    if (!medicalRep) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    const {
      id: repId,
      subscriptionPlanId,
      subscriptionStart,
      subscriptionEnd,
    } = medicalRep;

    if (!subscriptionPlanId || !subscriptionStart || !subscriptionEnd) {
      throw new BadRequestError(ErrorMessages.NO_ACTIVE_SUB);
    }

    const currentPlan =
      await this._subscriptionRepository.findSubscriptionById(
        subscriptionPlanId
      );

    const newPlan =
      await this._subscriptionRepository.findSubscriptionById(newPlanId);

    if (!currentPlan || !newPlan) {
      throw new NotFoundError(ErrorMessages.SUB_NOT_FOUND);
    }

    if (newPlan.price <= currentPlan.price) {
      throw new BadRequestError(ErrorMessages.DOWN_GRADE_PLAN);
    }
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const startDate = new Date(subscriptionStart);
    const endDate = new Date(subscriptionEnd);
    const now = new Date();

    const totalDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY)
    );

    const remainingDays = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / MS_PER_DAY)
    );

    const pricePerDay = currentPlan.price / totalDays;
    const creditAmount = pricePerDay * remainingDays;
    
    const finalPrice = Math.max(0, newPlan.price - creditAmount);
    
    const checkoutUrl = await this._paymentService.createCheckoutSession(
      repId,
      newPlan,
      finalPrice 
    );

    if (!checkoutUrl) {
      throw new BadRequestError(ErrorMessages.SUB_ATTEMPT_FAILED);
    }


    return {
      checkoutUrl,
      prorationDetails: {
        creditAmount, 
        daysRemaining: remainingDays,
        finalPrice, 
        originalPrice: newPlan.price, 
      },
    };
  }
}
