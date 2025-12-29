import { IFeature } from "../entities/IFeautre";

export interface IFeatureRepository {
  getAllFeatures(): Promise<IFeature[]>;
  createFeature(data: Omit<IFeature, "createdAt" | "id">): Promise<IFeature>;
  updateFeature(featureId: string, data: Partial<IFeature>): Promise<IFeature | null>;
  deleteFeature(featureId: string): Promise<IFeature | null>;
}
