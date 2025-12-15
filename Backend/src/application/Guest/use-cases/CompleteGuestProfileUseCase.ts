import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, NotFoundError } from "../../errors";
import { ICompleteGuestProfileUseCase } from "../interefaces/ICompleteGuestProfileUseCase";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { GuestMapper } from "../mappers/GuestMapper";
import { GuestProfileCompleteDTO } from "../dto/ProfileCompleteDTO";

export class CompleteGuestProfileUseCase
  implements ICompleteGuestProfileUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _userRepository: IUserRepository,
    private _territoryRepository: ITerritoryRepository
  ) { }

  async execute(data: GuestProfileCompleteDTO, userId?: string): Promise<string> {
    if (!userId) {
      throw new BadRequestError(ErrorMessages.UNAUTHORIZED);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }
    const existingGuest = await this._guestRepository.findGuestByuserId(userId);
    if (existingGuest) {
      throw new BadRequestError(ErrorMessages.GUEST_ALREADY_EXISTS);
    }
    const territory = await this._territoryRepository.findById(
      data.territoryId
    );
    if (!territory) {
      throw new NotFoundError(ErrorMessages.TERR_NOT_FOUND);
    }

    const mappedData = GuestMapper.toEntity(data, user.email, userId);
    const result = await this._guestRepository.createGuest(mappedData);
    if (!result) return ErrorMessages.PROFILE_UPDATE_FAIL;

    return SuccessMessages.PROFILE_UPDATED;
  }
}
