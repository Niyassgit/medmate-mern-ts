import { NotificationFullResponseDTO } from "../dto/NotificaionFullResponseDTO";

export interface IGetRepNotificationsUseCase {
  execute(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<NotificationFullResponseDTO>;
}
