import { GuestProfileCompleteDTO } from "../dto/ProfileCompleteDTO";

export interface ICompleteGuestProfileUseCase {
  execute(data: GuestProfileCompleteDTO, userId?: string): Promise<string>;
}
