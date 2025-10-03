import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { NotFoundError } from "../../errors";
import { CompleteRepProfileDTO } from "../dto/CompleteRepProfileDTO";
import { MedicalRepMapper } from "../mapper/MedicalRepMapper";

export class CompleteRepProfileUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _medicalRepository: IMedicalRepRepository
  ) {}
  async execute(userId: string, data: CompleteRepProfileDTO): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    const existingRep = await this._medicalRepository.getMedicalRepByUserId(
      user.id
    );
    const repEntity = MedicalRepMapper.toMedicalRepEntity(data, user.id);
    if (!existingRep) {
      await this._medicalRepository.createMedicalRep(repEntity);
      return "profile created Successfully";
    } else {
      await this._medicalRepository.completeProfile(existingRep.id, data);
      return "Profile updated successfully";
    }
  }
}
