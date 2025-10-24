import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { NotFoundError } from "../../errors";
import { MedicalRepDetailsDTO } from "../../medicalRep/dto/MedicalRepDetailsDTO";
import { RepDetailsMapper } from "../../medicalRep/mapper/RepDetailsMapper";
import { IGetMedicalRepDetailsUseCase } from "../interfaces/IGetMedicalRepDetailsUseCase";

export class GetMedicalRepDetailsUseCase
  implements IGetMedicalRepDetailsUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _storageService:IStorageService,
  ) {}

  async execute(userId: string): Promise<MedicalRepDetailsDTO | null> {
    const rep = await this._medicalRepRepository.getMedicalRepById(userId);
    if (!rep) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    let signedUrl=null;
    if(rep.user?.profileImage){
      signedUrl=await this._storageService.generateSignedUrl(rep.user.profileImage);
    }
    const userDetails = RepDetailsMapper.toMedicalRepDetails(rep,signedUrl);
    return userDetails;
  }
}
