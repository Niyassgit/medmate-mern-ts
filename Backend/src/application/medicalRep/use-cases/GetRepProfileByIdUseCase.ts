import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { NotFoundError } from "../../errors";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import { RepDetailsMapper } from "../mapper/RepDetailsMapper";
import { UserMapper } from "../../common/mapper/UserMapper";
import { UserProfileDTO } from "../../common/dto/UserProfileDTO";
import { IGetRepProfileByIdUseCase } from "../interfaces/IGetRepProfileByIdUseCase";
import { ErrorMessages } from "../../../shared/messages";

export class GetRepProfileByIdUseCase implements IGetRepProfileByIdUseCase{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(
    userId: string
  ): Promise<MedicalRepDetailsDTO | UserProfileDTO | null> {
    const rep = await this._medicalRepRepository.getMedicalRepByUserId(userId);
    if (!rep) {
      const user = await this._userRepository.findById(userId);
      if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
      return UserMapper.toUserProfile(user);
    }
    return RepDetailsMapper.toMedicalRepDetails(rep);
  }
}
