export interface IVerifyOldPasswordUseCase {
  execute(
    password: string,
    userId?: string
  ): Promise<{ isVerified: boolean; message: string }>;
}
