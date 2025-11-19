import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IMarkNotificationAsReadUseCase } from "../interfaces/IMakNotificationAsReadUseCase";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase{
    constructor(
        private _notificationRepository:INotificationRepository
    ){}
    async execute(notificationId: string,userId?:string): Promise<void> {
        if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const result=await this._notificationRepository.markNotificationAsRead(notificationId);
        if(!result) throw new BadRequestError(ErrorMessages.NOTIFICATION_ISREAD);
  
    }
}