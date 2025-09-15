import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IGoogleAuthService } from "../../../domain/common/services/IGoogleAuthService";
import { GoogleLoginDTO } from "../dto/GoogleLoginDTO";
import { JWTServices } from "../../../infrastructure/services/JwtService";
import { IUserLogin } from "../../../domain/common/entities/IUserLogin";
import { UnautharizedError } from "../../../domain/common/errors";

export class GoogleLoginUseCase {
  constructor(
    private _userRepository: IUserLoginRepository,
    private _googleAuthService: IGoogleAuthService,
    private _jwtServices: JWTServices
  ) {}

  async execute(
    payload: GoogleLoginDTO
  ): Promise<{ accessToken: string; refreshToken: string; user: IUserLogin }> {
    const { email, providerId } = await this._googleAuthService.verifyIdToken(
      payload.idToken
    );

    if (!email) throw new UnautharizedError("Google account has no email");

    const user = await this._userRepository.upsertGoogleUser({
      email,
      providerId,
      role: payload.role,
    });

    const acessPayload = { userId: user.id, role: user.role };
    const refreshPayload={userId:user.id,role:user.role,tokenVersion:user.tokenVersion}
    const accessToken =await this._jwtServices.signAccessToken(acessPayload);
    const refreshToken = await this._jwtServices.signRefreshToken(refreshPayload);

    return { accessToken, refreshToken, user };
  }
}
