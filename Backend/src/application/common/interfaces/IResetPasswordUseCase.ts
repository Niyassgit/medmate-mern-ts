export interface IResetPasswordUseCase {
  execute(email:string,password:string,otp:string): Promise<string>;
}
