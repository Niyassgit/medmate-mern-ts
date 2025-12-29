
import { MedicalRepRepository } from '../../../infrastructure/repositories/MedicalRepRepository';
import { SubscriptionRepository } from '../../../infrastructure/repositories/SubscriptionRepository';

export class PermissionService {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private medicalRepRepository: MedicalRepRepository
    ) { }

    async hasFeature(userId: string, featureKey: string): Promise<boolean> {
        // 1. Get Rep details to find subscriptionId (assuming userId is loginId or linked to Rep)

        const rep = await this.medicalRepRepository.getMedicalRepByUserId(userId);
        if (!rep) {
            // Try finding by ID directly if passed ID is RepID
            const repById = await this.medicalRepRepository.getMedicalRepById(userId);
            if (!repById) return false;

            return this.checkSubscriptionForFeature(repById, featureKey);
        }

        return this.checkSubscriptionForFeature(rep, featureKey);
    }

    private async checkSubscriptionForFeature(rep: { subscriptionPlanId?: string | null, subscriptionStatus?: boolean | null }, featureKey: string): Promise<boolean> {
        if (!rep.subscriptionPlanId) return false;
        if (!rep.subscriptionStatus) return false; // Inactive logic handling

        // Check expiry?
        // if (rep.subscriptionEnd < new Date()) return false;

        const plan = await this.subscriptionRepository.findSubscriptionById(rep.subscriptionPlanId);
        if (!plan) return false;

        return plan.features.includes(featureKey);
    }
}
