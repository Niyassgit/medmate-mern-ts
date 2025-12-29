import { IFeatureRepository } from "../../../domain/subscription/repositories/IFeatureRepository";
import { IFeature } from "../../../domain/subscription/entities/IFeautre";
import { IDeleteFeatureUseCase } from "../interfaces/IDeleteFeatureUseCase";
import { NotFoundError } from "../../errors/NotFoundError";
import { ERROR_MESSAGES } from "../../common/constants/ErrorMessages";

export class DeleteFeatureUseCase implements IDeleteFeatureUseCase {
    constructor(private featureRepository: IFeatureRepository) { }

    async execute(id: string): Promise<IFeature> {
        const result = await this.featureRepository.deleteFeature(id);
        if (!result) {
            throw new NotFoundError(ERROR_MESSAGES.FEATURE_NOT_FOUND);
        }
        return result;
    }
}
