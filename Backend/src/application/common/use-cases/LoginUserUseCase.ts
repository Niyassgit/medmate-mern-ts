import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { IUser } from "../../../domain/common/entities/IUser";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IJWtService } from "../../../domain/common/services/IJWTService";
import {
  UnautharizedError,
  BadRequestError,
  ForbiddenError,
} from "../../../domain/common/errors";

export class LoginUserUseCase {
  constructor(
    private _userLoginRepository: IUserRepository,
    private _bcryptServices: IBcryptService,
    private _jwtServices: IJWtService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const user = await this._userLoginRepository.findByEmail(email);
    if (!user) throw new UnautharizedError("User not found");

    if (!user.password) throw new BadRequestError("Password is required");
    const isValidUser = await this._bcryptServices.compare(
      password,
      user.password
    );
    if (!isValidUser) throw new UnautharizedError("Invalid password");
    if (user.isBlocked) throw new ForbiddenError("User is blocked");
    if (!user.isVerified)
      throw new ForbiddenError("Please verify email before logging in");

    const accessPayload = { userId: user.id, role: user.role };
    const refreshPayload = {
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = this._jwtServices.signAccessToken(accessPayload);
    const refreshToken = this._jwtServices.signRefreshToken(refreshPayload);

    return { accessToken, refreshToken, user };
  }
}
