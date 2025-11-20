export interface INotificationUnreadCountUsecase {
  execute(userId: string): Promise<number>;
}
