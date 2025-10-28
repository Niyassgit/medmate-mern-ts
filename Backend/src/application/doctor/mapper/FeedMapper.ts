import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IProductPostForFeed } from "../../../domain/product/entity/IProductPostForFeed";
import { FeedDTO } from "../dto/FeedDTO";

export class FeedMapper {
  static async toListFeeds(
    entities: IProductPostForFeed[],
    storageService: IStorageService
  ): Promise<FeedDTO[]> {
    const feedList = await Promise.all(
      entities.map(async (feed): Promise<FeedDTO> => {
        let imageUrl: string | null = null;
        let profileImage:string | null =null;

        if (feed.imageUrl && feed.imageUrl.length > 0) {
          imageUrl = await storageService.generateSignedUrl(feed.imageUrl[0]);
        }
        if(feed.rep.image){
           profileImage =await storageService.generateSignedUrl(feed.rep.image);
        }

        return {
          id: feed.id,
          title: feed.title,
          image: imageUrl ?? null,
          useCases: feed.useCases,
          likes: feed._count.likes ?? 0,
          createdAt: feed.createdAt,
          interests: feed._count.isInterested ?? 0,
          rep:{
            id:feed.rep.id,
            company:feed.rep.company,
            name:feed.rep.name,
            ProfileImage:profileImage
          }
        };
      })
    );

    return feedList;
  }
}
