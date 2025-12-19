import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { RepBusinessStatDTO } from "../dto/RepBusinessStatDTO";
import { IRepBusinessAnalyticsUseCase } from "../interfaces/IRepBusinessAnalyticsUseCase";
import { PrescriptionOrderMapper } from "../mapper/PrescriptionOrderMapper";

export class RepBusinessAnalyticsUseCase
  implements IRepBusinessAnalyticsUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _orderRepository: IOrderRepository,
    private _storageService: IStorageService
  ) { }
  async execute(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<RepBusinessStatDTO> {

    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }
    const orders = await this._orderRepository.getRepAnalytics(
      repId,
      start,
      end
    );
    return PrescriptionOrderMapper.toBusinessStat(
      orders,
      repId,
      this._storageService
    );
  }
}
