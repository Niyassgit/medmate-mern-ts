import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IVerifyOldPasswordUseCase } from "../interfaces/IverifyOldPasswordUsesCase";

export class VerifyOldPasswordUseCase implements IVerifyOldPasswordUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _bcryptService: IBcryptService
  ) {}
  async execute(
    password: string,
    userId?: string
  ): Promise<{ isVerified: boolean; message: string }> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const user = await this._userRepository.findById(userId);
    if (!user || !user.password)
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const compare = await this._bcryptService.compare(password, user?.password);
    if (!compare)
      return { isVerified: false, message: ErrorMessages.PASSWORD_NOT_MATCHED };
    return {
      isVerified: true,
      message: SuccessMessages.PASSWORD_MATCHED,
    };
  }
}
