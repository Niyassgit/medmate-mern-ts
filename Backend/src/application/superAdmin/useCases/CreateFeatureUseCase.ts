import { IFeatureRepository } from "../../../domain/subscription/repositories/IFeatureRepository";
import { IFeature } from "../../../domain/subscription/entities/IFeautre";

import { ICreateFeatureUseCase } from "../interfaces/ICreateFeatureUseCase";

export class CreateFeatureUseCase implements ICreateFeatureUseCase {
    constructor(private featureRepository: IFeatureRepository) { }

    async execute(data: Omit<IFeature, "createdAt" | "id">): Promise<IFeature> {
        return this.featureRepository.createFeature(data);
    }
}
