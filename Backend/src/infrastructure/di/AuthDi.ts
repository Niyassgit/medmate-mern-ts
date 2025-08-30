import { AuthController } from "../../presentation/http/controllers/AuthController";
import { LoginUserUseCase } from "../../application/common/LoginUserUseCase";
import { UserLoginRepository } from "../repositories/UserLoginRepository";
import { BcryptServices } from "../services/BcryptService";
import { JWTServices } from "../services/JwtService";

const userLoginRepository=new UserLoginRepository();
const bcryptServices=new BcryptServices();
const jwtService=new JWTServices()


const loginUserUseCase=new LoginUserUseCase(userLoginRepository,bcryptServices,jwtService);


export const authController=new AuthController(loginUserUseCase);