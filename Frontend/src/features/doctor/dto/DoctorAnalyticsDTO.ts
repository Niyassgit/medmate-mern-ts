import { RepListOnDoctorAnalyticsDTO } from "./RepListOnDocAnlyticsDTO";


export interface DoctorAnalyticsDTO {
  mutualConnectionsCount: number;
  pendingRequestCount: number;
  mutualConnections: RepListOnDoctorAnalyticsDTO[];
}
