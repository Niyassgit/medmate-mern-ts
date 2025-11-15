import { NotFoundError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages } from "../../../shared/Messages";
import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";
import { IGetRepNotificationsUseCase } from "../interfaces/IGetRepNotificationsUseCase";
import { ANotificationMapper } from "../mappers/ANotificationMapper";

export class GetRepNotificationsUseCase implements IGetRepNotificationsUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId: string): Promise<NotificationsResponseDTO[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const notifications =
      await this._notificationRepository.findAllNotifications(userId);
    if (!notifications) return [];
    return ANotificationMapper.toListDomain(
      notifications,
      this._storageService
    );
  }
}
