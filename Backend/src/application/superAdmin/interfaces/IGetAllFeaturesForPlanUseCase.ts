import { FeatureDTO } from "../dto/FeatureDTO";

export interface IGetAllFeaturesForPlanUseCase {
  execute(userId?: string): Promise<FeatureDTO[]>;
}
