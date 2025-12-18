import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { RepOrderDTO } from "../dto/RepOrderDTO";
import { IGetAllOrdersUseCase } from "../interfaces/IGetAllOrdersUseCase";
import { PrescriptionOrderMapper } from "../mapper/PrescriptionOrderMapper";

export class GetAllOrdersUseCase implements IGetAllOrdersUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _orderRepository: IOrderRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId?: string): Promise<RepOrderDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const orders = await this._orderRepository.findOrdersByRepId(repId);
    return Promise.all(
      orders.map((o) =>
        PrescriptionOrderMapper.toDomain(o, repId, this._storageService)
      )
    );
  }
}
