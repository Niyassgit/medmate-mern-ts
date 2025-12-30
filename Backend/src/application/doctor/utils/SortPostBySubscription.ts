import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostForFeed } from "../../../domain/productPost/entity/IProductPostForFeed";
import { ISubscriptionRepositoy } from "../../../domain/subscription/repositories/ISubscriptionRepository";
import { Feature } from "../../../shared/Enums";
import { PermissionService } from "../../common/services/PermissionService";

export class SortPostBySubscription {
  static async sorted(
    posts: IProductPostForFeed[],
    medicalRepRepository: IMedicalRepRepository,
    subscriptionRepository?: ISubscriptionRepositoy
  ): Promise<IProductPostForFeed[]> {
    const repIds = [...new Set(posts.map((post) => post.repId))];
    const reps = await medicalRepRepository.findByIds(repIds);
    
    // Check which reps have FEED_ENHANCEMENT feature
    const feedEnhancedRepIds = new Set<string>();
    
    if (subscriptionRepository) {
      for (const rep of reps) {
        const hasFeature = await PermissionService.hasFeatureForRep(
          rep,
          Feature.FEED_ENHANCEMENT,
          subscriptionRepository
        );
        if (hasFeature) {
          feedEnhancedRepIds.add(rep.id);
        }
      }
    } else {
      // Fallback to old method if subscriptionRepository not provided
      const subscribedRepIds = new Set(
        reps.filter(
          (rep) =>
            rep.subscriptionStatus &&
            rep.subscriptionEnd &&
            new Date(rep.subscriptionEnd) > new Date()
        ).map(rep => rep.id)
      );
      subscribedRepIds.forEach(id => feedEnhancedRepIds.add(id));
    }
    
    return posts.sort((a, b) => {
      const aHasFeature = feedEnhancedRepIds.has(a.repId);
      const bHasFeature = feedEnhancedRepIds.has(b.repId);

      if (aHasFeature && !bHasFeature) return -1;
      if (!aHasFeature && bHasFeature) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}
