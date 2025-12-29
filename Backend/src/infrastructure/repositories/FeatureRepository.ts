import { IFeatureRepository } from "../../domain/subscription/repositories/IFeatureRepository";
import { BaseRepository } from "../database/BaseRepository";
import { IFeature } from "../../domain/subscription/entities/IFeautre";
import { Feature, Prisma, PrismaClient } from "@prisma/client";

export class FeatureRepository
  extends BaseRepository<
    IFeature,
    Feature,
    Prisma.FeatureCreateInput,
    "feature"
  >
  implements IFeatureRepository {
  constructor(client: PrismaClient) {
    super(client.feature, (feature) => ({
      id: feature.id,
      key: feature.key,
      description: feature.description,
      createdAt: feature.createdAt,
    }));
  }

  async getAllFeatures(): Promise<IFeature[]> {
    return this.findAll();
  }

  async createFeature(
    data: Omit<IFeature, "createdAt" | "id">
  ): Promise<IFeature> {
    return this.create(data);
  }

  async updateFeature(
    featureId: string,
    data: Partial<IFeature>
  ): Promise<IFeature | null> {
    const updated = await this.update(featureId, data);
    return updated;
  }

  async deleteFeature(featureId: string): Promise<IFeature | null> {
    const feature = await this.findById(featureId);
    if (!feature) {
      return null;
    }
    await this.delete(featureId);
    return feature;
  }
}
