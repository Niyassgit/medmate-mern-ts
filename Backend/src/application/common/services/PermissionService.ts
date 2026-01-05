import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionRepository } from "../../../domain/subscription/repositories/ISubscriptionRepository";

export class PermissionService {
  constructor(
    private readonly _subscriptionRepository: ISubscriptionRepository,
    private readonly _medicalRepRepository: IMedicalRepRepository
  ) {}

  async hasFeature(userId: string, featureKey: string): Promise<boolean> {
    const rep = await this._medicalRepRepository.getMedicalRepByUserId(userId);
    if (!rep) {
      const repById = await this._medicalRepRepository.getMedicalRepById(
        userId
      );
      if (!repById) return false;

      return this.checkSubscriptionForFeature(repById, featureKey);
    }

    return this.checkSubscriptionForFeature(rep, featureKey);
  }

  private async checkSubscriptionForFeature(
    rep: {
      subscriptionPlanId?: string | null;
      subscriptionStatus?: boolean | null;
      subscriptionEnd?: Date | null;
    },
    featureKey: string
  ): Promise<boolean> {
    if (!rep.subscriptionPlanId) return false;
    if (!rep.subscriptionStatus) return false;
    if (rep.subscriptionEnd && new Date(rep.subscriptionEnd) <= new Date()) {
      return false;
    }

    const plan = await this._subscriptionRepository.findSubscriptionById(
      rep.subscriptionPlanId
    );
    if (!plan) return false;

    return plan.features.includes(featureKey);
  }

  static async hasFeatureForRep(
    rep: {
      subscriptionPlanId?: string | null;
      subscriptionStatus?: boolean | null;
      subscriptionEnd?: Date | null;
    },
    featureKey: string,
    subscriptionRepository: ISubscriptionRepository
  ): Promise<boolean> {
    if (!rep.subscriptionStatus || !rep.subscriptionPlanId) return false;
    if (rep.subscriptionEnd && new Date(rep.subscriptionEnd) <= new Date()) {
      return false;
    }

    const plan = await subscriptionRepository.findSubscriptionById(
      rep.subscriptionPlanId
    );
    if (!plan) return false;

    return plan.features.includes(featureKey);
  }
}
