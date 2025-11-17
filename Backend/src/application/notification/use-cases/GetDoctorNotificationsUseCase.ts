import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
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
    private _doctorRepository:IDoctorRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService,
    private _connectionRepository:IConnectionRepository
  ) {}
  async execute(userId: string): Promise<NotificationsResponseDTO[]> {
    const {doctorId} = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctorId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const notifications =
      await this._notificationRepository.findAllNotifications(userId);
    if (!notifications.length) return [];
    const mapped = ANotificationMapper.toListDomain(
      notifications,
      doctorId,
      this._storageService,
      this._connectionRepository
    );
    return mapped;
  }
}
