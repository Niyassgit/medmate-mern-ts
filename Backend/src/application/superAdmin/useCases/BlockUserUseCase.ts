import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";

export class BlockUserUseCase {
  constructor(private _userLoginRepository: IUserRepository) {}

  async execute(userId: string) {
    return await this._userLoginRepository.updateBlockStatus(userId, true);
  }
}
