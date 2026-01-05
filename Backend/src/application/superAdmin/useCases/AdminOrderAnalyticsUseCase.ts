import { UnautharizedError } from "../../../domain/common/errors";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { OrderAnalyticsDTO } from "../dto/OrderAnalyticsDTO";
import { IAdminOrderAnalyticsUseCase } from "../interfaces/IAdminOrderAnalyticsUseCase";
import { OrderAnalyticsMapper } from "../mappers/OrderAnalyticsMapper";
import {
  CommissionPeriodUtil,
  CommissionPeriod,
} from "../../doctor/utils/CommissionPeriodUtil";
import { RevenuePeriodUtil } from "../utils/RevenuePeriodUtil";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";

export class AdminOrderAnalyticsUseCase implements IAdminOrderAnalyticsUseCase {
  constructor(
    private _orderRepository: IOrderRepository,
    private _prescriptionRepository: IPrescriptionRepository
  ) {}
  async execute(
    startDate?: string,
    endDate?: string,
    userId?: string
  ): Promise<OrderAnalyticsDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { start, end } = CommissionPeriodUtil.calculateDateRange(
      startDate,
      endDate
    );

    const startDateObj = new Date(start);
    startDateObj.setHours(0, 0, 0, 0);

    const endDateObj = new Date(end);
    endDateObj.setHours(23, 59, 59, 999);

    const [
      paidOrders,
      grossAmount,
      doctorEarnings,
      adminEarnings,
      revenueData,
    ] = await Promise.all([
      this._orderRepository.countPaidOrders(startDateObj, endDateObj),
      this._orderRepository.sumGrossAmount(startDateObj, endDateObj),
      this._orderRepository.sumDoctorEarnings(startDateObj, endDateObj),
      this._orderRepository.sumAdminEarnings(startDateObj, endDateObj),
      this._orderRepository.revenueTimeline(startDateObj, endDateObj),
    ]);

    const period: CommissionPeriod = CommissionPeriodUtil.determinePeriod(
      startDateObj,
      endDateObj
    );
    const revenueTimeline = RevenuePeriodUtil.groupRevenueByPeriod(
      revenueData,
      period,
      startDateObj,
      endDateObj
    );

    const totalPrescriptions =
      await this._prescriptionRepository.findCountOfAllPrescriptions(
        startDateObj,
        endDateObj
      );
    const unpaidPrescriptions = Math.max(totalPrescriptions - paidOrders, 0);
    const mappedData = OrderAnalyticsMapper.todomain(
      totalPrescriptions,
      paidOrders,
      grossAmount,
      doctorEarnings,
      unpaidPrescriptions,
      adminEarnings,
      revenueTimeline
    );

    return mappedData;
  }
}
