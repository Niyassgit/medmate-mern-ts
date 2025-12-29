import { IFeature } from "../../../domain/subscription/entities/IFeautre";

export interface IUpdateFeatureUseCase {
    execute(id: string, data: Partial<IFeature>): Promise<IFeature | null>;
}
