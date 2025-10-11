import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IJWtService } from "../../../domain/common/services/IJWTService";
import {
  BadRequestError,
  ForbiddenError,
} from "../../../domain/common/errors";
import { LoginResponseDTO } from "../dto/LoginResponseDTO";
import { UserMapper } from "../mapper/UserMapper";
import { ILoginUserUseCase } from "../interfaces/ILoginUserUseCase";
import { ErrorMessages } from "../../../shared/messages";

export class LoginUserUseCase implements ILoginUserUseCase{
  constructor(
    private _userLoginRepository: IUserRepository,
    private _bcryptServices: IBcryptService,
    private _jwtServices: IJWtService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<LoginResponseDTO> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    if (!user.password) throw new BadRequestError(ErrorMessages.PASSWORD_REQUIRED);
    const isValidUser = await this._bcryptServices.compare(
      password,
      user.password
    );
    if (!isValidUser) throw new BadRequestError(ErrorMessages.INVALID_CREDENTIALS);
    if (user.isBlocked) throw new ForbiddenError(ErrorMessages.USER_BLOCKED);
    if (!user.isVerified)
      throw new ForbiddenError(ErrorMessages.VERIFY_EMAIL);

    const accessPayload = { userId: user.id, role: user.role };
    const refreshPayload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = this._jwtServices.signAccessToken(accessPayload);
    const refreshToken = this._jwtServices.signRefreshToken(refreshPayload);
    const mappedUser=UserMapper.toUserProfile(user);
    return { accessToken, refreshToken, mappedUser};
  }
}
