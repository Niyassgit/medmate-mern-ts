import { INotificationRepository } from "../../../domain/notification/repositories/INotificationService";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { INotificationUnreadCountUsecase } from "../interfaces/INotificationUnreadCountUseCase";

export class NotificationUnreadCountUseCase
  implements INotificationUnreadCountUsecase
{
  constructor(
    private _notificationRepository: INotificationRepository
  ) {}
  async execute(userId: string): Promise<number> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const count =
      await this._notificationRepository.getCountOfUnreadNotification(userId);
    return count;
  }
}
