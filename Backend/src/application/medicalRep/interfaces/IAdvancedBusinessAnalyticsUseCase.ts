import { AdvancedBusinessAnalyticsDTO } from "../dto/AdvancedBusinessAnalyticsDTO";

export interface IAdvancedBusinessAnalyticsUseCase {
  execute(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<AdvancedBusinessAnalyticsDTO>;
}
