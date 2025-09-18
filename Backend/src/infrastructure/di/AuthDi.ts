import { AuthController } from "../../presentation/http/controllers/AuthController";
import { LoginUserUseCase } from "../../application/common/use-cases/LoginUserUseCase";
import { GoogleLoginUseCase } from "../../application/common/use-cases/GoogleLoginUseCase";
import { UserRepository } from "../repositories/UserLoginRepository";
import { GooglePrecheckUseCase } from "../../application/common/use-cases/GooglePrecheckUseCase.ts";
import { GetNewAccessTokenUseCase } from "../../application/common/use-cases/GetNewAcccessTokenUseCase";
import { VerifySignupOtpUseCase } from "../../application/common/use-cases/VerifySignupOtpUseCase";
import { BcryptServices } from "../services/BcryptService";
import { JWTServices } from "../services/JwtService";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { OtpService } from "../services/OtpService";
import { ResendOtpUseCase } from "../../application/common/use-cases/ResendOtpUseCase";
import { NotificationService } from "../services/NotificationService";
import { ForgotPasswordUseCase } from "../../application/common/use-cases/ForgotPasswordUseCase";
import { VerifyForgotPasswordOtpUseCase } from "../../application/common/use-cases/VerifyForgotPasswordOtpUseCase";
import { ResetPasswordUseCase } from "../../application/common/use-cases/ResetPasswordUseCase";
import { ResetPasswordResendOtpUseCase } from "../../application/common/use-cases/ResetPasswordResendOtpUseCase";

const userRepository=new UserRepository();
const bcryptServices=new BcryptServices();
const jwtServices=new JWTServices()
const googleAuthService=new GoogleAuthService();
const otpService=new OtpService();
const notificationService=new NotificationService()

const loginUserUseCase=new LoginUserUseCase(userRepository,bcryptServices,jwtServices);
const googleLoginUseCase=new GoogleLoginUseCase(userRepository,googleAuthService,jwtServices);
const googlePrecheckUseCase= new GooglePrecheckUseCase(userRepository,googleAuthService,jwtServices);
const getNewAcccessTokenUseCase= new GetNewAccessTokenUseCase(userRepository,jwtServices);
const verifySignupOtpUseCase=new VerifySignupOtpUseCase(userRepository,otpService,bcryptServices);
const resendOtpuseCase=new ResendOtpUseCase(userRepository,otpService,notificationService);
const forgotPasswordUseCase =new ForgotPasswordUseCase(userRepository,otpService,notificationService);
const verifyForgotPasswordOtpUseCase=new VerifyForgotPasswordOtpUseCase(userRepository,bcryptServices,otpService);
const resetPasswordUseCase=new ResetPasswordUseCase(userRepository,otpService,bcryptServices);
const resetPasswordResendOtpUseCase=new ResetPasswordResendOtpUseCase(userRepository,otpService,notificationService);

export const authController=new AuthController(
    loginUserUseCase,
    googleLoginUseCase,
    googlePrecheckUseCase,
    getNewAcccessTokenUseCase,
    verifySignupOtpUseCase,
    resendOtpuseCase,
    forgotPasswordUseCase,
    verifyForgotPasswordOtpUseCase,
    resetPasswordUseCase,
    resetPasswordResendOtpUseCase

);