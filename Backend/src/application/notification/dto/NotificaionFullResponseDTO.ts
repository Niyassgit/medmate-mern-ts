import { NotificationsResponseDTO } from "./NotificationsResponseDTO";

export interface NotificationFullResponseDTO{
    data:NotificationsResponseDTO[],
    nextCursor:string | null,
    hasMore:boolean
}