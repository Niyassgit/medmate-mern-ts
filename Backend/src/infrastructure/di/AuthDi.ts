import { AuthController } from "../../presentation/http/controllers/AuthController";
import { LoginUserUseCase } from "../../application/common/use-cases/LoginUserUseCase";
import { GoogleLoginUseCase } from "../../application/common/use-cases/GoogleLoginUseCase";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { BcryptServices } from "../services/BcryptService";
import { JWTServices } from "../services/JwtService";
import { GoogleAuthService } from "../services/GoogleAuthService";

const userLoginRepository=new UserLoginRepository();
const bcryptServices=new BcryptServices();
const jwtServices=new JWTServices()
const googleAuthService=new GoogleAuthService()


const loginUserUseCase=new LoginUserUseCase(userLoginRepository,bcryptServices,jwtServices);
const googleLoginUseCase=new GoogleLoginUseCase(userLoginRepository,googleAuthService,jwtServices);

export const authController=new AuthController(loginUserUseCase,googleLoginUseCase);