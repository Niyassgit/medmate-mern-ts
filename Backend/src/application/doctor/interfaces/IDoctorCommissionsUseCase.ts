import { DoctorCommissionDashboardDTO } from "../dto/DoctorCommissionDashboardDTO";
import { CommissionPeriod } from "../utils/CommissionPeriodUtil";

export interface IDoctorCommissionsUseCase {
  execute(
    startDate?: string,
    endDate?: string,
    userId?: string,
    period?: CommissionPeriod,
    cursor?: string
  ): Promise<DoctorCommissionDashboardDTO>;
}
