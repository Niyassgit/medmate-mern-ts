import { IJWtService } from "../../../domain/common/services/IJWTService";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { UnautharizedError } from "../../../domain/common/errors";
import { IGetNewAccessTokenUseCase } from "../interfaces/IGetNewAccessTokenUseCase";
import { ErrorMessages } from "../../../shared/messages";

export class GetNewAccessTokenUseCase implements IGetNewAccessTokenUseCase{
  constructor(
    private _userLoginRepository: IUserRepository,
    private _jwtService: IJWtService
  ) {}

  async execute(refreshToken: string): Promise<string> {
    const decoded = this._jwtService.verifyRefreshToken(refreshToken);
    if (!decoded) throw new UnautharizedError(ErrorMessages.INVALID_REFRESHTOKEN);
    const user = await this._userLoginRepository.findById(decoded.userId);

    if (!user) throw new UnautharizedError(ErrorMessages.USER_NOT_FOUND);

    const accessPayload = { userId: user.id, role: user.role };
    const newAccessToken = this._jwtService.signAccessToken(accessPayload);

    return newAccessToken;
  }
}
