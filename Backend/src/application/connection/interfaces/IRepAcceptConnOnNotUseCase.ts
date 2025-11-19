export interface IRepAcceptConnOnNotUseCase {
  execute(
    doctorId: string,
    notificationId: string,
    userId?: string
  ): Promise<string>;
}
