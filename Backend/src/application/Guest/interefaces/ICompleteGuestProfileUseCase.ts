import { GuestProfileCompleteDTO } from "../dto/GuestProfileCompleteDTO";

export interface ICompleteGuestProfileUseCase {
  execute(data: GuestProfileCompleteDTO, userId?: string): Promise<string>;
}
