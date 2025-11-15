import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";
import { IGetDoctorNotificationsUseCase } from "../interfaces/IGetDoctorNotificationsUseCase";
import { ANotificationMapper } from "../mappers/ANotificationMapper";

export class GetDoctorNotificationsUseCase
  implements IGetDoctorNotificationsUseCase
{
  constructor(
    private _userRepository:IUserRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId: string): Promise<NotificationsResponseDTO[]> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const notifications =
      await this._notificationRepository.findConnectionNotifications(userId);
    if (!notifications.length) return [];
    const mapped = ANotificationMapper.toListDomain(
      notifications,
      this._storageService
    );
    return mapped;
  }
}
