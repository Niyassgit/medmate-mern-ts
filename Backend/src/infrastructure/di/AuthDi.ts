import { AuthController } from "../../presentation/http/controllers/AuthController";
import { LoginUserUseCase } from "../../application/common/use-cases/LoginUserUseCase";
import { GoogleLoginUseCase } from "../../application/common/use-cases/GoogleLoginUseCase";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { GooglePrecheckUseCase } from "../../application/common/use-cases/GooglePrecheckUseCase.ts";
import { GetNewAccessTokenUseCase } from "../../application/common/use-cases/GetNewAcccessTokenUseCase";
import { VerifyOtpUseCase } from "../../application/common/use-cases/VerifyOtpUseCase";
import { BcryptServices } from "../services/BcryptService";
import { JWTServices } from "../services/JwtService";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { OtpService } from "../services/OtpService";
import { ResendOtpUseCase } from "../../application/common/use-cases/ResendOtpUseCase";
import { NotificationService } from "../services/NotificationService";

const userLoginRepository=new UserLoginRepository();
const bcryptServices=new BcryptServices();
const jwtServices=new JWTServices()
const googleAuthService=new GoogleAuthService();
const otpService=new OtpService();
const notificationService=new NotificationService()

const loginUserUseCase=new LoginUserUseCase(userLoginRepository,bcryptServices,jwtServices);
const googleLoginUseCase=new GoogleLoginUseCase(userLoginRepository,googleAuthService,jwtServices);
const googlePrecheckUseCase= new GooglePrecheckUseCase(userLoginRepository,googleAuthService,jwtServices);
const getNewAcccessTokenUseCase= new GetNewAccessTokenUseCase(userLoginRepository,jwtServices);
const verifyOtpUseCase=new VerifyOtpUseCase(userLoginRepository,otpService,bcryptServices);
const resendOtpuseCase=new ResendOtpUseCase(userLoginRepository,otpService,notificationService);

export const authController=new AuthController(
    loginUserUseCase,
    googleLoginUseCase,
    googlePrecheckUseCase,
    getNewAcccessTokenUseCase,
    verifyOtpUseCase,
    resendOtpuseCase
);