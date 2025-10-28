import { IUser } from "../../../domain/common/entities/IUser";
export interface IBlockUserUseCase {
  execute(userId: string): Promise<IUser | null>;
}
