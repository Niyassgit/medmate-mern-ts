import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { NotFoundError } from "../../errors";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import { RepDetailsMapper } from "../mapper/RepDetailsMapper";
import { UserMapper } from "../../common/mapper/UserMapper";
import { UserProfileDTO } from "../../common/dto/UserProfileDTO";
import { IGetRepProfileByIdUseCase } from "../interfaces/IGetRepProfileByIdUseCase";
import { ErrorMessages } from "../../../shared/Messages";
import { IStorageService } from "../../common/services/IStorageService";

export class GetRepProfileByIdUseCase implements IGetRepProfileByIdUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    userId: string
  ): Promise<MedicalRepDetailsDTO | UserProfileDTO | null> {
    const rep = await this._medicalRepRepository.getMedicalRepByUserId(userId);

    if (!rep) {
      const user = await this._userRepository.findById(userId);
      if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
      const profileImageUrl = user.profileImage
        ? await this._storageService.generateSignedUrl(user.profileImage)
        : null;
      return UserMapper.toUserProfile(user, profileImageUrl);
    }
    const profileImageKey = rep.user?.profileImage;
    const profileImageUrl = profileImageKey
      ? await this._storageService.generateSignedUrl(profileImageKey)
      : null;
    return RepDetailsMapper.toMedicalRepDetails(rep, profileImageUrl);
  }
}
