import { IJWtService } from "../../../domain/common/services/IJWTService";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IGoogleAuthService } from "../../../domain/common/services/IGoogleAuthService";
import { GooglePrecheckResultDTO } from "../dto/GooglePrecheckResultDTO";
import { IGooglePrecheckUseCase } from "../interfaces/IGooglePrecheckUseCase";
import { UserMapper } from "../mapper/UserMapper";

export class GooglePrecheckUseCase implements IGooglePrecheckUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService,
    private _jwtServices: IJWtService
  ) { }

  async execute(idToken: string): Promise<GooglePrecheckResultDTO> {
    const { email } = await this._googleAuthService.verifyIdToken(idToken);

    if (!email) return { exists: false };

    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) return { exists: false };

    const jwtPayload = { userId: user.id, role: user.role };
    const refreshPayload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = this._jwtServices.signAccessToken(jwtPayload);
    const refreshToken = this._jwtServices.signRefreshToken(refreshPayload);

    const userDto = UserMapper.toAuthUser(user, user.profileImage || null);

    return { exists: true, accessToken, refreshToken, user: userDto };
  }
}

