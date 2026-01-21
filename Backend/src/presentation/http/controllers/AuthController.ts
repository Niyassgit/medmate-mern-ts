import { Request, Response, NextFunction } from "express";
import { env } from "../../../infrastructure/config/env";
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
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import {
  Cookie,
  ResetPasswordBody,
  PreCheckRequestBody,
  VerifyOtpBody,
  resendOtpBody,
  ForgotPasswordBody,
} from "../../types/auth";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";

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
    private _resetPasswordResendOtpUseCase: IResetPasswordResendOtpUseCase,
  ) {}

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginRequestBody;
      const result = await this._userLoginUseCase.execute(email, password);

      res.cookie("refreshtoken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: env.maxAge,
      });

      const response: AuthResponseDTO = {
        accessToken: result.accessToken,
        user: result.user,
      };
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies as Cookie;
      const token = cookies.refreshtoken;
      if (!token)
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: ErrorMessages.NO_REFRESH });

      const newAccessToken =
        await this._getNewAccessTokenUsecase.execute(token);
      res.status(HttpStatusCode.OK).json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken, role } = req.body as GoogleLoginDTO;
      const result = await this._googleLoginUseCase.execute({ idToken, role });
      res.cookie("refreshtoken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: env.maxAge,
      });

      const response: AuthResponseDTO = {
        accessToken: result.accessToken,
        user: result.user,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  googlePrecheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = req.body as PreCheckRequestBody;
      const result = await this._googlePrecheckUseCase.execute(idToken);
      if (
        !result.exists ||
        !result.accessToken ||
        !result.refreshToken ||
        !result.user
      ) {
        return res.json({ exists: false });
      }

      res.cookie("refreshtoken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: Number(process.env.MAX_AGE),
      });

      const response: AuthResponseDTO = {
        accessToken: result.accessToken,
        user: result.user,
      };

      res.status(HttpStatusCode.OK).json({ exists: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  verifySignupOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body as VerifyOtpBody;
      const response = await this._verifySignupOtpUseCase.execute(email, otp);
      res.status(HttpStatusCode.OK).json({ success: true, message: response });
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as resendOtpBody;
      const response = await this._resendOtpUseCase.execute(email);
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as ForgotPasswordBody;
      const response = await this._forgotPasswordUseCase.execute(email);
      res.status(HttpStatusCode.OK).json({ success: true, ...response });
    } catch (error) {
      next(error);
    }
  };

  verifyResetPassOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, otp } = req.body as VerifyOtpBody;
      const response = await this._verifyForgotPasswordOtpUseCase.execute(
        email,
        otp,
      );
      res.status(HttpStatusCode.OK).json({ success: true, message: response });
    } catch (error) {
      next(error);
    }
  };

  forgotPasswordResendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
        password,
        otp,
      );
      res.status(HttpStatusCode.OK).json({ success: true, message: response });
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
    return res
      .status(HttpStatusCode.NO_CONTENT)
      .json({ message: SuccessMessages.LOGOUT_SUCCESS });
  };
}
