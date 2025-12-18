import {
    BadRequestError,
    NotFoundError,
    UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { ErrorMessages } from "../../../shared/Messages";
import { OrderDetailDTO } from "../dto/OrderDetailDTO";
import { IGetOrderDetailUseCase } from "../interefaces/IGetOrderDetailUseCase";
import { OrderApplicationMapper } from "../mappers/OrderApplicationMapper";

export class GetOrderDetailUseCase implements IGetOrderDetailUseCase {
    constructor(
        private _orderRepository: IOrderRepository,
        private _guestRepository: IGuestRepository,
        private _storageService: IStorageService
    ) { }

    async execute(orderId: string, userId?: string): Promise<OrderDetailDTO> {
        if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

        const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
        if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

        const order = await this._orderRepository.findOrderDetailsById(orderId);
        if (!order) throw new NotFoundError(ErrorMessages.ORDER_NOT_FOUND);

        if (order.guestId !== guestId) {
            throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        }

        return OrderApplicationMapper.toDetailDomain(order, this._storageService);
    }
}
