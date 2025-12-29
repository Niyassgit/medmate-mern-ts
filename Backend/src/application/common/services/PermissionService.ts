
import { MedicalRepRepository } from '../../../infrastructure/repositories/MedicalRepRepository';
import { SubscriptionRepository } from '../../../infrastructure/repositories/SubscriptionRepository';

export class PermissionService {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private medicalRepRepository: MedicalRepRepository
    ) { }

    async hasFeature(userId: string, featureKey: string): Promise<boolean> {

        const rep = await this.medicalRepRepository.getMedicalRepByUserId(userId);
        if (!rep) {
            const repById = await this.medicalRepRepository.getMedicalRepById(userId);
            if (!repById) return false;

            return this.checkSubscriptionForFeature(repById, featureKey);
        }

        return this.checkSubscriptionForFeature(rep, featureKey);
    }

    private async checkSubscriptionForFeature(rep: { subscriptionPlanId?: string | null, subscriptionStatus?: boolean | null }, featureKey: string): Promise<boolean> {
        if (!rep.subscriptionPlanId) return false;
        if (!rep.subscriptionStatus) return false; 

        const plan = await this.subscriptionRepository.findSubscriptionById(rep.subscriptionPlanId);
        if (!plan) return false;

        return plan.features.includes(featureKey);
    }
}
