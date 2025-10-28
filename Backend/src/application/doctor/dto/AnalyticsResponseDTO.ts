import { RepListOnDoctorDTO } from "./RepListOnDoctorDTO";

export interface AnalyticsResponseDTO {
  mutualConnectionsCount: number;
  pendingRequestCount: number;
  mutualConnections: RepListOnDoctorDTO[];
}
