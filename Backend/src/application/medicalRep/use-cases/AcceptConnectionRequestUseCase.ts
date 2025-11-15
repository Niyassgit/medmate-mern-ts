import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ConnectionStatus, NotificationType, Role } from "../../../shared/Enums";
import { ErrorMessages, NotificationMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { IAcceptConnectionRequestUseCase } from "../interfaces/IAcceptConnectionRequestUseCase";

export class AcceptingConnectionRequest
  implements IAcceptConnectionRequestUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository:INotificationRepository
  ) {}
  async execute(doctorId: string, userId?: string): Promise<string> {
    if (!userId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const {repId} = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const {doctorUserId} = await this._doctorRepository.getUserIdByDoctorId(doctorId);
    if (!doctorUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
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
      Role.MEDICAL_REP,
      doctorUserId,
      Role.DOCTOR,
      NotificationType.CONNECTION_ACCEPTED,
      NotificationMessages.CONNECTION_ACCEPT_MESSAGE
    )
    return SuccessMessages.CONNECTED;
  }
}
