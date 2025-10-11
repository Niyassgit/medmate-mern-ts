import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IGoogleAuthService } from "../../../domain/common/services/IGoogleAuthService";
import { GoogleLoginDTO } from "../dto/GoogleLoginDTO";
import { IJWtService } from "../../../domain/common/services/IJWTService";
import { UnautharizedError } from "../../../domain/common/errors";
import { GoogleLoginResponseDTO } from "../dto/GoogleLoginResponseDTO";
import { IGoogleLoginUseCase } from "../interfaces/IGoogleLoginUseCase";
import { ErrorMessages } from "../../../shared/messages";

export class GoogleLoginUseCase implements IGoogleLoginUseCase{
  constructor(
    private _userRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService,
    private _jwtServices: IJWtService
  ) {}

  async execute(
    payload: GoogleLoginDTO
  ): Promise<GoogleLoginResponseDTO> {
    const { email, providerId } = await this._googleAuthService.verifyIdToken(
      payload.idToken
    );

    if (!email) throw new UnautharizedError(ErrorMessages.GOOGLE_UNAUTHRISED);

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
