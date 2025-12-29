import { IFeature } from "../../../domain/subscription/entities/IFeautre";
import { FeatureDTO } from "../dto/FeatureDTO";

export class FeatureMapper {
  static toDomain(data: IFeature): FeatureDTO {
    return {
      id: data.id,
      description: data.description,
      key: data.key,
      createdAt: data.createdAt,
    };
  }

  static toEntity(data: FeatureDTO): Omit<IFeature, "id" | "createdAt"> {
    return {
      description: data.description,
      key: data.key,
    };
  }
}
