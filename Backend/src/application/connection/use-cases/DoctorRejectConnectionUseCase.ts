import { NotFoundError } from "../../../domain/common/errors";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ConnectionStatus, NotificationType } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { IDoctorRejectConnectionUseCase } from "../interfaces/IDoctorRejectConnectionUseCase";

export class DoctorRejectConnectionUseCase
  implements IDoctorRejectConnectionUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository
  ) {}
  async execute(
    repId: string,
    notificationId: string,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const connection=await this._connectionRepository.findByDoctorAndRep(doctorId,repId);
    if(!connection) throw new NotFoundError(ErrorMessages.CONNECTION_NOT_FOUND);
    const res =
      await this._connectionRepository.rejectConnectionByDoctorAndRepIds(
        doctorId,
        repId,
        ConnectionStatus.REJECTED
      );
    if (!res) return ErrorMessages.CONNECTION_REJECT_FAILED;
    const updated =
      await this._notificationRepository.updateNotificationById(
        notificationId,
        NotificationType.CONNECTION_REJECT
      );
    if (!updated) return ErrorMessages.CONNECTION_REJECT_FAILED;
    return SuccessMessages.CONNECTION_REJECT;
  }
}
