import { BadRequestError } from "../../errors";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IGetSubscriptionStatusUseCase } from "../interfaces/IGetSubscriptionStatusUseCase";
import { UnautharizedError } from "../../../domain/common/errors";
import { SubscriptionStatusDTO } from "../dto/SubscriptionStatusDTO";
import { SubscriptionMapper } from "../mappers/SubscriptionMapper";

export class GetSubscriptionStatusUseCase
  implements IGetSubscriptionStatusUseCase
{
  constructor(private _medicalRepRepository: IMedicalRepRepository) {}

  async execute(userId?: string): Promise<SubscriptionStatusDTO> {
    console.log("userId:",userId);
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);

    if (!repId) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    const repDetails = await this._medicalRepRepository.getMedicalRepById(
      repId
    );

    if (!repDetails) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    return SubscriptionMapper.statusToDomain(repDetails);
  }
}
















