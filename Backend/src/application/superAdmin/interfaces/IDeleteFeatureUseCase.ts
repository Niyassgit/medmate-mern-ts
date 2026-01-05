import { IFeature } from "../../../domain/subscription/entities/IFeautre";

export interface IDeleteFeatureUseCase {
    execute(id: string): Promise<IFeature | null>;
}
