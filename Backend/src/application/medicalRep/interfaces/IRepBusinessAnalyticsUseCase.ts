import { RepBusinessStatDTO } from "../dto/RepBusinessStatDTO";

export interface IRepBusinessAnalyticsUseCase {
  execute(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<RepBusinessStatDTO>;
}
