export interface IDoctorAcceptOnNotUseCase {
  execute(
    repId: string,
    notificationId: string,
    userId?: string
  ): Promise<string>;
}
