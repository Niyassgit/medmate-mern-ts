import { OrderAnalyticsDTO } from "../dto/OrderAnalyticsDTO";

export interface IAdminOrderAnalyticsUseCase {
  execute(
    startDate?: string,
    endDate?: string,
    userId?: string
  ): Promise<OrderAnalyticsDTO>;
}
