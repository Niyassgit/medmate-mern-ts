import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IGoogleAuthService } from "../../../domain/common/services/IGoogleAuthService";
import { GoogleLoginDTO } from "../dto/GoogleLoginDTO";
import { IJWtService } from "../../../domain/common/services/IJWTService";
import { IUser } from "../../../domain/common/entities/IUser";
import { UnautharizedError } from "../../../domain/common/errors";

export class GoogleLoginUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService,
    private _jwtServices: IJWtService
  ) {}

  async execute(
    payload: GoogleLoginDTO
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
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
    const refreshPayload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = this._jwtServices.signAccessToken(acessPayload);
    const refreshToken = this._jwtServices.signRefreshToken(refreshPayload);

    return { accessToken, refreshToken, user };
  }
}
