import {
    BadRequestError,
    UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { OrderDetailDTO } from "../../Guest/dto/OrderDetailDTO";
import { OrderApplicationMapper } from "../../Guest/mappers/OrderApplicationMapper";
import { IGetOrderDetailsUseCase } from "../interfaces/IGetOrderDetailsUseCase";


export class GetOrderDetailsUseCase implements IGetOrderDetailsUseCase {
    constructor(
        private _medicalRepRepository: IMedicalRepRepository,
        private _orderRepository: IOrderRepository,
        private _storageService: IStorageService
    ) { }
    async execute(orderId: string, userId?: string): Promise<OrderDetailDTO> {
        if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
        const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
        if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

        const order = await this._orderRepository.findOrderDetailsById(orderId);
        if (!order) throw new BadRequestError(ErrorMessages.ORDER_NOT_FOUND);

        return OrderApplicationMapper.toDetailDomain(order, this._storageService, repId);
    }
}
