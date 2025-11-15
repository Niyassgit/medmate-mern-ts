import { NotFoundError } from "../../../domain/common/errors";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import {
  ConnectionInitiator,
  ConnectionStatus,
  NotificationType,
  Role,
} from "../../../shared/Enums";
import { ErrorMessages, NotificationMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IConnectionRequestUseCase } from "../interfaces/IConnectionRequestUseCase";

export class ConnectionRequestUseCase implements IConnectionRequestUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _connectionRepository: IConnectionRepository,
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(repId: string, userId?: string): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const {repUserId} = await this._medicalRepRepository.getUserIdByRepId(repId);
    if (!repUserId) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
      await this._connectionRepository.findByDoctorAndRep(doctorId, repId);
    if (existingConnection) {
      if (existingConnection.status === ConnectionStatus.PENDING) {
        await this._connectionRepository.deleteByDoctorAndRep(doctorId, repId);
        await this._notificationRepository.deleteConnectionNotificationById(
          userId,
          repUserId
        );
        return SuccessMessages.CANCEL_CONNECTION_REQ;
      }
      if (existingConnection.status === ConnectionStatus.ACCEPTED) {
        return ErrorMessages.ALREADY_CONNECTED;
      }
    }
    const connection = await this._connectionRepository.createConnection(
      doctorId,
      repId,
      ConnectionInitiator.DOCTOR
    );
    if (!connection)
      throw new BadRequestError(ErrorMessages.CONNECTION_REQUEST);
    await this._notificationRepository.createNotification(
      userId,
      Role.DOCTOR,
      repUserId,
      Role.MEDICAL_REP,
      NotificationType.CONNECTION_REQUEST,
     NotificationMessages.CONNECTION_REQ_NOTIFICATION_MESSAGE
    );
    return SuccessMessages.CONNECTION_REQUEST;
  }
}
