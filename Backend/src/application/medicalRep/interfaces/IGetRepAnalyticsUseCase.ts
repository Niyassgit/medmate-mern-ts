import { AnalyticsDTO } from "../dto/AnalyticsDTO";

export interface IGetRepAnalyticsUseCase {
    execute(userId: string): Promise<AnalyticsDTO | null>;
}