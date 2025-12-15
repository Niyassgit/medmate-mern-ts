import { ProfileDTO } from "../dto/ProfileDTO";

export interface IGetProfileDetailsUseCase {
  execute(userId?: string): Promise<ProfileDTO>;
}
