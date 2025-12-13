import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { ErrorMessages } from "../../../shared/Messages";
import { OrderDTO } from "../dto/OrderDTO";
import { IGetOrdersUseCase } from "../interefaces/IGetOrdersUseCase";
import { OrderApplicationMapper } from "../mappers/OrderApplicationMapper";

export class GetOrdersUseCase implements IGetOrdersUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _orderRepository: IOrderRepository,
    private _storageService: IStorageService,
  ) { }
  async execute(userId?: string): Promise<OrderDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
    if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const orders = await this._orderRepository.findAllOrders(guestId);
    return await Promise.all(
      orders.map((o) =>
        OrderApplicationMapper.toDomain(o, this._storageService)
      )
    );
  }
}
