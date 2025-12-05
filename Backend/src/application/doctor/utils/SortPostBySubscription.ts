import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IProductPostForFeed } from "../../../domain/product/entity/IProductPostForFeed";

export class SortPostBySubscription {
  static async sorted(
    posts: IProductPostForFeed[],
    medicalRepRepository: IMedicalRepRepository
  ): Promise<IProductPostForFeed[]> {
    const repIds = [...new Set(posts.map((post) => post.repId))];
    const reps = await medicalRepRepository.findByIds(repIds);
    const subscribedRepIds = new Set(
      reps.filter(
        (rep) =>
          rep.subscriptionStatus &&
          rep.subscriptionEnd &&
          new Date(rep.subscriptionEnd) > new Date()
      ).map(rep=>rep.id)
    );
    
    return posts.sort((a,b)=>{
        const aSubscribed=subscribedRepIds.has(a.repId);
        const bSubscribed=subscribedRepIds.has(b.repId);

        if(aSubscribed && !bSubscribed) return -1;
        if(!aSubscribed && bSubscribed) return 1;
        return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
    })
  }
}
