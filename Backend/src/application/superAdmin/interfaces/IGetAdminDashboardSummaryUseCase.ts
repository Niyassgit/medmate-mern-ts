import { StatusSummaryDTO } from "../dto/StatsSummaryDTO";

export interface IGetAdminDashBoardSummaryUseCase{
execute(userId?:string):Promise<StatusSummaryDTO>;
}