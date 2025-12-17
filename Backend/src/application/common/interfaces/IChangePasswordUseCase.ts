import { Role } from "../../../shared/Enums";

export interface IChangePasswordUseCase {
  execute(role: Role,newPassword:string, userId?: string): Promise<string>;
}
