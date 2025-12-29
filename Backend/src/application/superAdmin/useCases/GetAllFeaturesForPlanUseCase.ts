import { UnautharizedError } from "../../../domain/common/errors";
import { IFeatureRepository } from "../../../domain/subscription/repositories/IFeatureRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { FeatureDTO } from "../dto/FeatureDTO";
import { IGetAllFeaturesForPlanUseCase } from "../interfaces/IGetAllFeaturesForPlanUseCase";
import { FeatureMapper } from "../mappers/FeatureMapper";

export class GetAllFeaturesForPlanUseCase
  implements IGetAllFeaturesForPlanUseCase
{
  constructor(private _featureRepository: IFeatureRepository) {}

  async execute(userId?: string): Promise<FeatureDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const features = await this._featureRepository.getAllFeatures();
    return features.map((f) => FeatureMapper.toDomain(f));
  }
}
