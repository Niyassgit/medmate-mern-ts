import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError, UnautharizedError } from "../../errors";
import { IDoctorAcceptOnNotUseCase } from "../interfaces/IDoctorAcceptOnNotUseCase";
import { ConnectionStatus, NotificationType } from "../../../shared/Enums";

export class DoctorAcceptOnNotUseCase implements IDoctorAcceptOnNotUseCase {
  constructor(
    private _doctorRepository:IDoctorRepository,
    private _notificationRepository:INotificationRepository,
    private _medicalRepRepository:IMedicalRepRepository,
    private _connectionRepository:IConnectionRepository,
  ) {}
  async execute(
    repId: string,
    notificationId: string,
    userId?: string
  ): Promise<string> {
 if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const {doctorId} = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctorId)
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingConnection =
         await this._connectionRepository.findByDoctorAndRep(doctorId, repId);
   
       if (!existingConnection)
         throw new BadRequestError(ErrorMessages.NO_CONNECTION_REQUEST_FOUND);
   
       if (existingConnection.status === ConnectionStatus.ACCEPTED)
         return ErrorMessages.ALREADY_CONNECTED;
   
       await this._connectionRepository.updateStatus(
         doctorId,
         repId,
         ConnectionStatus.ACCEPTED
       );
   
       await this._notificationRepository.updateNotificationById(
         notificationId,
         NotificationType.CONNECTION_ACCEPTED
       );
   
       return SuccessMessages.CONNECTED;
     }
}
