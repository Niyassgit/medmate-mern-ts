import { StatusSummaryDTO } from "../dto/StatsSummaryDTO";

export interface IGetAdminDashBoardSummaryUseCase{
  execute(userId?: string, startDate?: string, endDate?: string): Promise<StatusSummaryDTO>;
}