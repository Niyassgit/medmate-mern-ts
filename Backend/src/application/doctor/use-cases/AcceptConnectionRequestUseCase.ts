import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ConnectionStatus, NotificationType, Role } from "../../../shared/Enums";
import { ErrorMessages, NotificationMessages, SuccessMessages } from "../../../shared/Messages";
import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../errors";
import { IAcceptConnectionRequestUseCase } from "../interfaces/IAcceptConnectionRequestUseCase";

export class AcceptConnectionRequestUseCase
  implements IAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepositoy: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository:INotificationRepository
  ) {}
  async execute(repId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const {doctorId} = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctorId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const {repUserId} = await this._medicalRepRepositoy.getUserIdByRepId(repId);
    if (!repUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const connection = await this._connectionRepository.findByDoctorAndRep(
     doctorId,
      repId
    );
    if (!connection || connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestError(ErrorMessages.NO_PENDING_REQ);
    }
    await this._connectionRepository.updateStatus(
      doctorId,
      repId,
      ConnectionStatus.ACCEPTED
    );
    await this._notificationRepository.createNotification(
      userId,
      Role.DOCTOR,
      repUserId,
      Role.MEDICAL_REP,
      NotificationType.CONNECTION_ACCEPTED,
     NotificationMessages.CONNECTION_ACCEPT_MESSAGE
    )
    return SuccessMessages.CONNECTED;
  }
}
