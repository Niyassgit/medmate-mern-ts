import { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "../../../application/common/use-cases/LoginUserUseCase";
import { GoogleLoginUseCase } from "../../../application/common/use-cases/GoogleLoginUseCase";
import { LoginRequestBody } from "../validators/LoginValidationSchema";
import { AuthResponseDTO } from "../../dto/AuthResponseDTO";
import { GoogleLoginDTO } from "../../../application/common/dto/GoogleLoginDTO";

export class AuthController {
  constructor(
    private _userLoginUseCase: LoginUserUseCase,
    private _googleLoginUseCase:GoogleLoginUseCase
  ) {}

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginRequestBody;
      const result = await this._userLoginUseCase.execute(email, password);

      res.cookie("refreshtoken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const response: AuthResponseDTO = {
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  googleLogin=async(req:Request,res:Response,next:NextFunction)=>{

    try {

      const {idToken,role}=req.body as GoogleLoginDTO;
      console.log("👉 Controller hit:", req.body);
      const result=await this._googleLoginUseCase.execute({idToken,role});
     console.log("👉 UseCase result:", result);
      res.cookie("refreshtoken",result.refreshToken,{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV === "production",
        maxAge:7 * 24 * 60 * 60 * 1000
      });

      const response: AuthResponseDTO = {
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      };
      
      res.json(response);
    } catch (error) {
      next(error);
      
    }
  }
}
