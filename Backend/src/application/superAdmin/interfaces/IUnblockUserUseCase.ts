import { IUser } from "../../../domain/common/entities/IUser";
export interface IUnblockUserUseCase {
  execute(userId: string): Promise<IUser | null>;
}
