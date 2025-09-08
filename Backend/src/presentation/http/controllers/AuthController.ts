import { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "../../../application/common/use-cases/LoginUserUseCase";
import { GoogleLoginUseCase } from "../../../application/common/use-cases/GoogleLoginUseCase";
import { LoginRequestBody } from "../validators/LoginValidationSchema";
import { AuthResponseDTO } from "../../dto/AuthResponseDTO";
import { GoogleLoginDTO } from "../../../application/common/dto/GoogleLoginDTO";
import { GooglePrecheckUseCase } from "../../../application/common/use-cases/GooglePrecheckUseCase.ts";

export class AuthController {
  constructor(
    private _userLoginUseCase: LoginUserUseCase,
    private _googleLoginUseCase:GoogleLoginUseCase,
    private _googlePrecheckUseCase:GooglePrecheckUseCase
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
      const result=await this._googleLoginUseCase.execute({idToken,role});
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


  googlePrecheck=async(req:Request,res:Response,next:NextFunction)=>{

    try {
      const {idToken}=req.body ;
      const result=await this._googlePrecheckUseCase.execute(idToken);
      if(!result.exists) return res.json({exists:false});

      res.cookie("refreshtoken",result.refreshToken,{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV === "production",
        maxAge: 7* 24 * 60 * 60 * 1000,
      });

      const response:AuthResponseDTO={
        accessToken:result.accessToken,
        user:{
          id:result.user.id,
          email:result.user.email,
          role:result.user.role,
        }
      }

      res.json({exists:true,...response})
      
    } catch (error) {
      next(error);
    }
  }
}
