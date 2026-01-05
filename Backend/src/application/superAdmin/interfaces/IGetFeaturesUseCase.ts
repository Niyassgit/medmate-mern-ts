import { IFeature } from "../../../domain/subscription/entities/IFeautre";

export interface IGetFeaturesUseCase {
    execute(): Promise<IFeature[]>;
}
