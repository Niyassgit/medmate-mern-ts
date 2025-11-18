import { IStorageService } from "../../../domain/common/services/IStorageService";
import { INotificationWithUser } from "../../../domain/notification/entities/INotificationWithUser";
import { IProductPostRepository } from "../../../domain/product/repositories/IProductPostRepository";
import { NotificationType } from "../../../shared/Enums";
import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";

export class ANotificationMapper {
  static async toDomain(
    entity: INotificationWithUser,
    storageService: IStorageService,
    productPostRepository?:IProductPostRepository,
  ): Promise<NotificationsResponseDTO> {
    let signedUrl: string | null = null;
    if (entity.user.profileImage) {
      signedUrl = await storageService.generateSignedUrl(
        entity.user.profileImage
      );
    }
    let postImage:string | null=null;
    if((entity.type === NotificationType.LIKE || entity.type === NotificationType.INTEREST) && entity.postId){
      const post =await productPostRepository?.findPostById(entity.postId);
      if(post?.imageUrl){
        postImage=await storageService.generateSignedUrl(post.imageUrl[0]);
      }
    }
    return {
      id: entity.id,
      content: entity.content,
      isRead: entity.isRead,
      type: entity.type,
      createdAt: entity.createdAt,
      roleId: entity.RoleId,
      user: {
        id: entity.user.id,
        name: entity.user.name,
        profileImage: signedUrl,
      },
      postId:entity.postId,
      postImage
    };
  }
  static async toListDomain(
    entity: INotificationWithUser[],
    storageService: IStorageService,
    productPostRepository?:IProductPostRepository
  ): Promise<NotificationsResponseDTO[]> {
    return Promise.all(
      entity.map((not) =>
        this.toDomain(not,storageService,productPostRepository)
      )
    );
  }
}
