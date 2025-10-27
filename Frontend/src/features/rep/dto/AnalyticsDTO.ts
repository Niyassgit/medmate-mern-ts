import { DoctorListOnAnalyticsDTO } from "./DoctorListOnAnalyticsDTO";

export interface AnalyticsDTO{
    mutualConnectionsCount:number,
    pendingRequestCount:number,
    mutualConnections:DoctorListOnAnalyticsDTO[],
}