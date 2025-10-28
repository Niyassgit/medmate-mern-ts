export interface IVerifySignupOtpUseCase{
  execute(email:string,otp:string):Promise<string>;
}