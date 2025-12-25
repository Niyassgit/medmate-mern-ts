import { IGetAdminEarningsUseCase } from "../interfaces/IGetAdminEarningsUseCase";
import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { AdminEarningsDTO } from "../dto/AdminEarningsDTO";

export class GetAdminEarningsUseCase implements IGetAdminEarningsUseCase {
    constructor(private _orderRepository: IOrderRepository) { }

    async execute(
        page: number,
        limit: number,
        startDate?: string,
        endDate?: string
    ): Promise<AdminEarningsDTO[]> {
        let start: Date | undefined;
        let end: Date | undefined;

        if (startDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
        }

        if (endDate) {
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
        }

        return await this._orderRepository.getAdminEarningsList(
            page,
            limit,
            start,
            end
        );
    }
}
