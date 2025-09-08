import { AuthController } from "../../presentation/http/controllers/AuthController";
import { LoginUserUseCase } from "../../application/common/use-cases/LoginUserUseCase";
import { GoogleLoginUseCase } from "../../application/common/use-cases/GoogleLoginUseCase";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { GooglePrecheckUseCase } from "../../application/common/use-cases/GooglePrecheckUseCase.ts";
import { GetNewAccessTokenUseCase } from "../../application/common/use-cases/GetNewAcccessTokenUseCase";
import { BcryptServices } from "../services/BcryptService";
import { JWTServices } from "../services/JwtService";
import { GoogleAuthService } from "../services/GoogleAuthService";

const userLoginRepository=new UserLoginRepository();
const bcryptServices=new BcryptServices();
const jwtServices=new JWTServices()
const googleAuthService=new GoogleAuthService()


const loginUserUseCase=new LoginUserUseCase(userLoginRepository,bcryptServices,jwtServices);
const googleLoginUseCase=new GoogleLoginUseCase(userLoginRepository,googleAuthService,jwtServices);
const googlePrecheckUseCase= new GooglePrecheckUseCase(userLoginRepository,googleAuthService,jwtServices);
const getNewAcccessTokenUseCase= new GetNewAccessTokenUseCase(userLoginRepository,jwtServices)

export const authController=new AuthController(
    loginUserUseCase,
    googleLoginUseCase,
    googlePrecheckUseCase,
    getNewAcccessTokenUseCase
);