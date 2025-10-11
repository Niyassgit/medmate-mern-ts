import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/messages";
import { NotFoundError } from "../../errors";
import { CompleteRepProfileDTO } from "../dto/CompleteRepProfileDTO";
import { ICompleteRepProfileUseCase } from "../interfaces/ICompleteRepProfileUseCase";
import { MedicalRepMapper } from "../mapper/MedicalRepMapper";

export class CompleteRepProfileUseCase implements ICompleteRepProfileUseCase{
  constructor(
    private _userRepository: IUserRepository,
    private _medicalRepository: IMedicalRepRepository
  ) {}
  async execute(userId: string, data: CompleteRepProfileDTO,file:Express.Multer.File |  null): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const existingRep = await this._medicalRepository.getMedicalRepByUserId(
      user.id
    );
    const logoUrl=file?`/uploads/company-logo/${file.filename}`:null;  
  
    if (!existingRep) {
        const repEntity = MedicalRepMapper.toMedicalRepEntity(data, user.id,logoUrl);
      await this._medicalRepository.createMedicalRep(repEntity);
      return SuccessMessages.PROFILE_UPDATED;
    } else {
      const updatedEntity=MedicalRepMapper.updateMedicalRepEntity(existingRep,data,logoUrl);
      await this._medicalRepository.completeProfile(existingRep.id,updatedEntity);
      return SuccessMessages.PROFILE_UPDATED;
    }
  }
}
