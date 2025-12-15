import { ProfileDTO } from "../dto/ProfileDTO";
import { IGetProfileDetailsUseCase } from "../interefaces/IGetProfileDetailsUseCase";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { BadRequestError, NotFoundError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";
import { GuestProfileMapper } from "../mappers/GuestProfileMapper";

export class GetProfileDetailsUseCase implements IGetProfileDetailsUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _userRepository: IUserRepository,
    private _territoryRepository: ITerritoryRepository,
    private _storageService: IStorageService
  ) {}

  async execute(userId?: string): Promise<ProfileDTO> {
    if (!userId) {
      throw new BadRequestError(ErrorMessages.UNAUTHORIZED);
    }

    const guest = await this._guestRepository.findGuestByuserId(userId);

    if (!guest) {
      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
      }

      const profileImageUrl = user.profileImage
        ? await this._storageService.generateSignedUrl(user.profileImage)
        : "";

      return GuestProfileMapper.toProfileDTOFromUser(user, profileImageUrl);
    }

    let territoryName = "Unknown";
    if (guest.territoryId) {
      const territory = await this._territoryRepository.findById(
        guest.territoryId
      );
      if (territory) {
        territoryName = territory.name;
      }
    }

    return GuestProfileMapper.toProfileDTO(guest, territoryName);
  }
}
