import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { AdvancedBusinessAnalyticsDTO } from "../dto/AdvancedBusinessAnalyticsDTO";
import { IAdvancedBusinessAnalyticsUseCase } from "../interfaces/IAdvancedBusinessAnalyticsUseCase";
import { PrescriptionOrderMapper } from "../mapper/PrescriptionOrderMapper";
import { AdvancedBusinessAnalyticsMapper } from "../mapper/AdvancedBusinessAnalyticsMapper";
import { CommissionPeriodUtil } from "../../doctor/utils/CommissionPeriodUtil";

export class AdvancedBusinessAnalyticsUseCase
  implements IAdvancedBusinessAnalyticsUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _orderRepository: IOrderRepository,
    private _storageService: IStorageService
  ) {}

  async execute(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<AdvancedBusinessAnalyticsDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const { start, end } = CommissionPeriodUtil.calculateDateRange(
      startDate,
      endDate
    );

    const orders = await this._orderRepository.getRepAnalytics(
      repId,
      start,
      end
    );

    const basicStats = await PrescriptionOrderMapper.toBusinessStat(
      orders,
      repId,
      this._storageService
    );

    const commissionPeriod = CommissionPeriodUtil.determinePeriod(start, end);

    const periodDiff = end.getTime() - start.getTime();
    const previousStart = new Date(start.getTime() - periodDiff - 1);
    const previousEnd = new Date(start.getTime() - 1);
    previousEnd.setHours(23, 59, 59, 999);

    const previousOrders = await this._orderRepository.getRepAnalytics(
      repId,
      previousStart,
      previousEnd
    );

    return AdvancedBusinessAnalyticsMapper.toAdvancedAnalytics(
      basicStats,
      orders,
      previousOrders,
      repId,
      commissionPeriod,
      start,
      end
    );
  }
}
