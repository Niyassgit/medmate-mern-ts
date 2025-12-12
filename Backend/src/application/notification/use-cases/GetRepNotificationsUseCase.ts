import { NotFoundError } from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { IProductPostRepository } from "../../../domain/productPost/repositories/IProductPostRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotificationFullResponseDTO } from "../dto/NotificaionFullResponseDTO";
import { IGetRepNotificationsUseCase } from "../interfaces/IGetRepNotificationsUseCase";
import { ANotificationMapper } from "../mappers/ANotificationMapper";

export class GetRepNotificationsUseCase implements IGetRepNotificationsUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService,
    private _productPostRepository: IProductPostRepository
  ) {}
  async execute(
    userId: string,
    cursor?: string,
    limit?: number
  ): Promise<NotificationFullResponseDTO> {
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const { notifications, nextCursor } =
      await this._notificationRepository.findAllNotifications(
        userId,
        cursor,
        limit
      );

    const mapped = await ANotificationMapper.toListDomain(
      notifications,
      this._storageService,
      this._productPostRepository
    );

    return {
      data: mapped,
      nextCursor,
      hasMore: nextCursor !== null,
    };
  }
}
