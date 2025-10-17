import { IUser } from "../../../domain/common/entities/IUser";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IUnblockUserUseCase } from "../interfaces/IUnblockUserUseCase";

export class UnBlockUserUseCase implements IUnblockUserUseCase {
  constructor(private _userLoginRepositories: IUserRepository) {}

  async execute(userId: string): Promise<IUser | null> {
    return await this._userLoginRepositories.updateBlockStatus(userId, false);
  }
}
