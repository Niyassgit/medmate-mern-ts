import { IFeatureRepository } from "../../../domain/subscription/repositories/IFeatureRepository";
import { IFeature } from "../../../domain/subscription/entities/IFeautre";
import { IUpdateFeatureUseCase } from "../interfaces/IUpdateFeatureUseCase";
import { NotFoundError } from "../../errors/NotFoundError";
import { ERROR_MESSAGES } from "../../common/constants/ErrorMessages";

export class UpdateFeatureUseCase implements IUpdateFeatureUseCase {
    constructor(private featureRepository: IFeatureRepository) { }

    async execute(id: string, data: Partial<IFeature>): Promise<IFeature> {
        const result = await this.featureRepository.updateFeature(id, data);
        if (!result) {
            throw new NotFoundError(ERROR_MESSAGES.FEATURE_NOT_FOUND);
        }
        return result;
    }
}
