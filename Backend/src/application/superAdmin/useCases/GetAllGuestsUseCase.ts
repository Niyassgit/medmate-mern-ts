import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { GuestsListResponseDTO } from "../dto/GuestsListResponseDTO";
import { IGetAllGuestsUseCase } from "../interfaces/IGetAllGuestsUseCase";
import { GuestListMapper } from "../mappers/GuestListMapper";

export class GetAllGuestsUseCase implements IGetAllGuestsUseCase {
  constructor(private _guestRepository: IGuestRepository) {}

  async execute(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<GuestsListResponseDTO> {
    const { guests, total } = await this._guestRepository.getAllGuests(
      page,
      limit,
      search,
      territory
    );
    
    return {
      guests: guests
        .filter((guest) => guest !== null && guest !== undefined && guest.id)
        .map((guest) => GuestListMapper.toGuestListDTO(guest)),
      total,
    };
  }
}

