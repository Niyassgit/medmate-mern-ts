import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { NotificationFullResponseDTO } from "../dto/NotificaionFullResponseDTO";
import { IGetDoctorNotificationsUseCase } from "../interfaces/IGetDoctorNotificationsUseCase";
import { ANotificationMapper } from "../mappers/ANotificationMapper";

export class GetDoctorNotificationsUseCase
  implements IGetDoctorNotificationsUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _notificationRepository: INotificationRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    userId: string,
    cursor?: string,
    limit?:number
  ): Promise<NotificationFullResponseDTO> {
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const { notifications, nextCursor } =
      await this._notificationRepository.findAllNotifications(
        userId,
        cursor,
        limit
      );

    const mapped = await ANotificationMapper.toListDomain(
      notifications,
      this._storageService
    );

    return {
      data: mapped,
      nextCursor,
      hasMore: nextCursor !== null,
    };
  }
}
