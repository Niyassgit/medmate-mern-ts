import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";

export class BlockUserUseCase {
  constructor(private _userLoginRepository: IUserRepository) {}

  async execute(userId: string) {
    return await this._userLoginRepository.updateBlockStatus(userId, true);
  }
}
