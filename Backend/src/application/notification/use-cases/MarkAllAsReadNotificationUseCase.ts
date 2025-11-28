import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IMakeAllAsReadNotificationUseCase } from "../interfaces/IMarkAllAsReadNotificartionUseCase";

export class MakeAllAsReadNotificationUseCase implements IMakeAllAsReadNotificationUseCase{
    constructor(
        private _notificationRepository:INotificationRepository,
        private _notificationEventPublisher:INotificationEventPublisher
    ){}
    async execute(userId: string): Promise<void> {
        if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const notifications=await this._notificationRepository.markAllNotificationAsRead(userId);
        if(!notifications) throw new BadRequestError(ErrorMessages.NOTIFICATION_ISREAD);
        
        const unreadCount =
          await this._notificationRepository.getCountOfUnreadNotification(userId);
        await this._notificationEventPublisher.unreadNotificationCount({
          receiverUserId: userId,
          count: unreadCount,
        });
    }
}