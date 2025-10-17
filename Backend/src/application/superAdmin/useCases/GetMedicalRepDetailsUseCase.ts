import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { MedicalRepDetailsDTO } from "../../medicalRep/dto/MedicalRepDetailsDTO";
import { RepDetailsMapper } from "../../medicalRep/mapper/RepDetailsMapper";
import { IGetMedicalRepDetailsUseCase } from "../interfaces/IGetMedicalRepDetailsUseCase";

export class GetMedicalRepDetailsUseCase
  implements IGetMedicalRepDetailsUseCase
{
  constructor(private _medicalRepRepository: IMedicalRepRepository) {}

  async execute(userId: string): Promise<MedicalRepDetailsDTO | null> {
    const user = await this._medicalRepRepository.getMedicalRepById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const userDetails = RepDetailsMapper.toMedicalRepDetails(user);
    return userDetails;
  }
}
