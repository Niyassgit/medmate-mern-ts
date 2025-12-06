import { IUser } from "../../../domain/common/entities/IUser";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBlockUserUseCase } from "../interfaces/IBlockUserUseCase";

export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(private _userLoginRepository: IUserRepository) {}

  async execute(userId: string): Promise<IUser | null> {
    return await this._userLoginRepository.updateBlockStatus(userId, true);
  }
}
