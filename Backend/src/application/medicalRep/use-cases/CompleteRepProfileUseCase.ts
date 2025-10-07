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
  async execute(userId: string, data: CompleteRepProfileDTO,file:Express.Multer.File |  null): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    const existingRep = await this._medicalRepository.getMedicalRepByUserId(
      user.id
    );
    const logoUrl=file?`/uploads/company-logo/${file.filename}`:null;  
  
    if (!existingRep) {
        const repEntity = MedicalRepMapper.toMedicalRepEntity(data, user.id,logoUrl);
      await this._medicalRepository.createMedicalRep(repEntity);
      return "profile created Successfully";
    } else {
      const updatedEntity=MedicalRepMapper.updateMedicalRepEntity(existingRep,data,logoUrl);
      await this._medicalRepository.completeProfile(existingRep.id,updatedEntity);
      return "Profile updated successfully";
    }
  }
}
