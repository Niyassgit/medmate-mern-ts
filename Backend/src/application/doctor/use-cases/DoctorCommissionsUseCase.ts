import { ICommissionRepository } from "../../../domain/commission/repositories/ICommissionRepository";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { DoctorCommissionDashboardDTO } from "../dto/DoctorCommissionDashboardDTO";
import { IDoctorCommissionsUseCase } from "../interfaces/IDoctorCommissionsUseCase";
import { CommissionMapper } from "../mapper/CommissionMapper";
import { CommissionPeriodUtil, CommissionPeriod } from "../utils/CommissionPeriodUtil";

export class DoctorCommissionsUseCase implements IDoctorCommissionsUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _commissionRepository: ICommissionRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _orderRepository: IOrderRepository
  ) { }

  async execute(
    startDate?: string,
    endDate?: string,
    userId?: string,
    period?: CommissionPeriod,
    cursor?: string
  ): Promise<DoctorCommissionDashboardDTO> {
    if (!userId) {
      throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    }

    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );

    if (!doctorId) {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    const { start, end } = CommissionPeriodUtil.calculateDateRange(
      startDate,
      endDate
    );

    if (start > end) {
      throw new BadRequestError(ErrorMessages.FILTER_DATE_WRONG);
    }

    if (cursor) {
      const cursorResult = await this._commissionRepository.findByDoctorIdWithCursor(
        doctorId,
        start,
        end,
        cursor,
        20
      );

      const allCommissions = await this._commissionRepository.findByDoctorId(
        doctorId,
        start,
        end
      );

      const periodType = period || CommissionPeriodUtil.determinePeriod(start, end);

      const totalPrescriptions = await this._prescriptionRepository.countPrescriptionsByDoctor(
        doctorId,
        start,
        end
      );

      const { topCompanies } = await this._getAnalyticsData(doctorId, start, end);

      const dashboard = CommissionMapper.toDomain(
        allCommissions,
        periodType,
        start,
        end,
        totalPrescriptions,
        topCompanies
      );

      const commissionItems = CommissionMapper.mapCommissionsToDTO(
        cursorResult.commissions
      );

      return {
        ...dashboard,
        commissions: commissionItems,
        nextCursor: cursorResult.nextCursor,
        hasMore: cursorResult.hasMore,
      };
    }

    const commissions = await this._commissionRepository.findByDoctorId(
      doctorId,
      start,
      end
    );

    const periodType = period || CommissionPeriodUtil.determinePeriod(start, end);

    const totalPrescriptions = await this._prescriptionRepository.countPrescriptionsByDoctor(
      doctorId,
      start,
      end
    );

    const { topCompanies } = await this._getAnalyticsData(doctorId, start, end);

    return CommissionMapper.toDomain(
      commissions,
      periodType,
      start,
      end,
      totalPrescriptions,
      topCompanies
    );
  }

  private async _getAnalyticsData(doctorId: string, start: Date, end: Date) {
    const topCompanies = await this._orderRepository.getTopCompaniesForDoctor(doctorId, start, end);

    return { topCompanies };
  }
}
