import { DoctorListOnRepDTO } from "./DoctorListOnRepDTO";

export interface AnalyticsDTO {
    mutualConnectionsCount: number;
    pendingRequestCount: number;
    mutualConnections: DoctorListOnRepDTO[];
}