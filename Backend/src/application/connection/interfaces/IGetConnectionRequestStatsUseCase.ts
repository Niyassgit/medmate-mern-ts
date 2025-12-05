import { ConnectionRequestStatsDTO } from "../dto/ConnectionRequestStatsDTO";

export interface IGetConnectionRequestStatsUseCase {
  execute(userId?: string): Promise<ConnectionRequestStatsDTO>;
}

