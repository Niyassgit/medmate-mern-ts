import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { INotificationWithUser } from "../../../domain/notification/entities/INotificationWithUser";
import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";

export class ANotificationMapper {
  static async toDomain(
    entity: INotificationWithUser,
    loggerId: string,
    storageService: IStorageService,
    connectionsRepository: IConnectionRepository
  ): Promise<NotificationsResponseDTO> {
    let signedUrl: string | null = null;
    if (entity.user.profileImage) {
      signedUrl = await storageService.generateSignedUrl(
        entity.user.profileImage
      );
    }
    return {
      id: entity.id,
      content: entity.content,
      isRead: entity.isRead,
      type: entity.type,
      createdAt: entity.createdAt,
      roleId: entity.RoleId,
      isConnected: (await connectionsRepository.findByDoctorAndRep(
        entity.RoleId,
        loggerId
      ))
        ? true
        : false,
      user: {
        id: entity.user.id,
        name: entity.user.name,
        profileImage: signedUrl,
      },
    };
  }
  static async toListDomain(
    entity: INotificationWithUser[],
    loggerId: string,
    storageService: IStorageService,
    connectionsRepository: IConnectionRepository
  ): Promise<NotificationsResponseDTO[]> {
    return Promise.all(
      entity.map((not) =>
        this.toDomain(not, loggerId, storageService, connectionsRepository)
      )
    );
  }
}
