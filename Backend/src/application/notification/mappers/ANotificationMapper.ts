import { IStorageService } from "../../../domain/common/services/IStorageService";
import { INotificationWithUser } from "../../../domain/notification/entities/INotificationWithUser";
import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";

export class ANotificationMapper {
  static async toDomain(
    entity: INotificationWithUser,
    storageService: IStorageService
  ): Promise<NotificationsResponseDTO> {
    let signedUrl: string | null = null;
    if (entity.user.profileImage) {
      signedUrl = await storageService.generateSignedUrl(
        entity.user.profileImage
      );
    }
    return{
        id:entity.id,
        content:entity.content,
        isRead:entity.isRead,
        type:entity.type,
        createdAt:entity.createdAt,
        roleId:entity.RoleId,
        user:{
            id:entity.user.id,
            name:entity.user.name,
            profileImage:signedUrl
        }
    }
  }
  static async toListDomain(entity:INotificationWithUser[],storageService:IStorageService):Promise<NotificationsResponseDTO[]>{
   return Promise.all(
    entity.map((not)=>this.toDomain(not,storageService))
   ); 
  }
}
