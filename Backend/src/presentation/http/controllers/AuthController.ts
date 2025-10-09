import { Request, Response, NextFunction } from "express";
import { ILoginUserUseCase } from "../../../application/common/interfaces/ILoginUserUseCase";
import { IGoogleLoginUseCase } from "../../../application/common/interfaces/IGoogleLoginUseCase"; 
import { LoginRequestBody } from "../validators/LoginValidationSchema";
import { AuthResponseDTO } from "../../dto/AuthResponseDTO";
import { GoogleLoginDTO } from "../../../application/common/dto/GoogleLoginDTO";
import { IGooglePrecheckUseCase } from "../../../application/common/interfaces/IGooglePrecheckUseCase"; 
import { IGetNewAccessTokenUseCase } from "../../../application/common/interfaces/IGetNewAccessTokenUseCase"; 
import { IResendOtpUseCase } from "../../../application/common/interfaces/IResendOtpUseCase";
import { IVerifySignupOtpUseCase } from "../../../application/common/interfaces/IVerifySignupOtpUseCase";
import { IForgotPasswordUseCase } from "../../../application/common/interfaces/IForgotPasswordUseCase"; 
import { IVerifyForgotPasswordOtpUseCase } from "../../../application/common/interfaces/IVerifiyForgotPasswordOtpUseCase";
import { IResetPasswordUseCase } from "../../../application/common/interfaces/IResetPasswordUseCase";
import { IResetPasswordResendOtpUseCase } from "../../../application/common/interfaces/IResetPasswordResendOtpUseCase";
import {
  Cookie,
  ResetPasswordBody,
  PreCheckRequestBody,
  VerifyOtpBody,
  resendOtpBody,
  ForgotPasswordBody,
} from "../../../types/express/auth";

export class AuthController {
  constructor(
    private _userLoginUseCase: ILoginUserUseCase,
    private _googleLoginUseCase: IGoogleLoginUseCase,
    private _googlePrecheckUseCase: IGooglePrecheckUseCase,
    private _getNewAccessTokenUsecase: IGetNewAccessTokenUseCase,
    private _verifySignupOtpUseCase: IVerifySignupOtpUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _verifyForgotPasswordOtpUseCase: IVerifyForgotPasswordOtpUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _resetPasswordResendOtpUseCase: IResetPasswordResendOtpUseCase
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
          id: result.mappedUser.id,
          email: result.mappedUser.email,
          role: result.mappedUser.role,
          image:result.mappedUser.profileImage,
        },
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies as Cookie;
      const token = cookies.refreshtoken;
      if (!token) return res.status(401).json({ message: " No refresh token" });

      const newAccessToken = await this._getNewAccessTokenUsecase.execute(
        token
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken, role } = req.body as GoogleLoginDTO;
      const result = await this._googleLoginUseCase.execute({ idToken,role});
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

  googlePrecheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = req.body as PreCheckRequestBody;
      const result = await this._googlePrecheckUseCase.execute(idToken);
      if (!result.exists) return res.json({ exists: false });

      res.cookie("refreshtoken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
         
      console.log("user role after the result",result.user.role);
      const response: AuthResponseDTO = {
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
      };

      res.json({ exists: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  verifySignupOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body as VerifyOtpBody;
      const response = await this._verifySignupOtpUseCase.execute(email, otp);
      res.json({ success: true, message: response });
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as resendOtpBody;
      const response = await this._resendOtpUseCase.execute(email);
      res.json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as ForgotPasswordBody;
      const response = await this._forgotPasswordUseCase.execute(email);
      res.json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  verifyResetPassOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, otp } = req.body as VerifyOtpBody;
      const response = await this._verifyForgotPasswordOtpUseCase.execute(
        email,
        otp
      );
      res.json({ success: true, message: response });
    } catch (error) {
      next(error);
    }
  };

  forgotPasswordResendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body as resendOtpBody;
      const response = await this._resetPasswordResendOtpUseCase.execute(email);
      res.json({ success: true, message: response });
    } catch (error) {
      next(error);
    }
  };
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp, password } = req.body as ResetPasswordBody;
      const response = await this._resetPasswordUseCase.execute(
        email,
        otp,
        password
      );
      res.json({ success: true, message: response });
    } catch (error) {
      next(error);
    }
  };

  logoutUser = (req: Request, res: Response) => {
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.json({ message: "Logged out successfully" });
  };
}
