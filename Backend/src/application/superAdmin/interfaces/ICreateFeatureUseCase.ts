import { IFeature } from "../../../domain/subscription/entities/IFeautre";

export interface ICreateFeatureUseCase {
    execute(data: Omit<IFeature, "createdAt" | "id">): Promise<IFeature>;
}
