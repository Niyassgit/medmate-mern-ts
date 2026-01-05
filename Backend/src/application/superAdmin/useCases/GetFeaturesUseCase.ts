import { IFeatureRepository } from "../../../domain/subscription/repositories/IFeatureRepository";
import { IFeature } from "../../../domain/subscription/entities/IFeautre";

import { IGetFeaturesUseCase } from "../interfaces/IGetFeaturesUseCase";

export class GetFeaturesUseCase implements IGetFeaturesUseCase {
    constructor(private featureRepository: IFeatureRepository) { }

    async execute(): Promise<IFeature[]> {
        return this.featureRepository.getAllFeatures();
    }
}
