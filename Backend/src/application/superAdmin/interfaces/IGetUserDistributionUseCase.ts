import { DistributionDTO } from "../dto/UserDistributionDTO";

export interface IGetUserDistributionUseCase {
  execute(userId?: string, startDate?: string, endDate?: string): Promise<DistributionDTO>;
}
