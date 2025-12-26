import { DoctorCommissionItemDTO } from "./DoctorCommissionItemDTO";
import { DoctorCommissionSummaryDTO } from "./DoctorCommissionSummaryDTO";
import { DoctorCommissionTimelineDTO } from "./DoctorCommissionTimelineDTO";


export interface DoctorCommissionDashboardDTO {
  summary: DoctorCommissionSummaryDTO;
  timeline: DoctorCommissionTimelineDTO[];
  commissions: DoctorCommissionItemDTO[];
  nextCursor?: string | null;
  hasMore?: boolean;
}
