import { NotFoundError } from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages } from "../../../shared/Messages";
import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";
import { IGetRepNotificationsUseCase } from "../interfaces/IGetRepNotificationsUseCase";
import { ANotificationMapper } from "../mappers/ANotificationMapper";

export class GetRepNotificationsUseCase implements IGetRepNotificationsUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService,
    private _connectionRepository: IConnectionRepository
  ) {}
  async execute(userId: string): Promise<NotificationsResponseDTO[]> {
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const notifications =
      await this._notificationRepository.findAllNotifications(userId);
    if (!notifications) return [];
    return ANotificationMapper.toListDomain(
      notifications,
      repId,
      this._storageService,
      this._connectionRepository
    );
  }
}
