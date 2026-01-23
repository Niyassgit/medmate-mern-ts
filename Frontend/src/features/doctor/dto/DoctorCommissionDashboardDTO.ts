import { DoctorCommissionItemDTO } from "./DoctorCommissionItemDTO";
import { DoctorCommissionSummaryDTO } from "./DoctorCommissionSummaryDTO";
import { DoctorCommissionTimelineDTO } from "./DoctorCommissionTimelineDTO";


export interface DoctorCommissionDashboardDTO {
  summary: DoctorCommissionSummaryDTO;
  timeline: DoctorCommissionTimelineDTO[];
  commissions: DoctorCommissionItemDTO[];
  topCompanies: { name: string; value: number }[];
  nextCursor?: string | null;
  hasMore?: boolean;
}
