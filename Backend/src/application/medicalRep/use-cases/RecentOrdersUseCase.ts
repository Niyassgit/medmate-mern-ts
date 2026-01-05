import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { OrderTableDTO } from "../dto/OrderTableDTO";
import { IRecentOrdersUseCase } from "../interfaces/IRecentOrdersUseCase";
import { PrescriptionOrderMapper } from "../mapper/PrescriptionOrderMapper";

export class RecentOrdersUseCase implements IRecentOrdersUseCase {
  constructor(
    private _orderRepository: IOrderRepository,
    private _medicalRepRepository: IMedicalRepRepository
  ) {}
  async execute(userId?: string): Promise<OrderTableDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const orders = await this._orderRepository.findOrdersByRepId(repId);
    return PrescriptionOrderMapper.toListOrderTable(orders, repId);
  }
}
