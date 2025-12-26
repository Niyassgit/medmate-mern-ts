import { IOrderRepository } from "../../../domain/order/repositories/IOrderRepository";
import { DoctorEarningsDTO } from "../dto/DoctorEarningsDTO";

export interface IGetDoctorEarningsUseCase {
    execute(
        page: number,
        limit: number,
        startDate?: string,
        endDate?: string
    ): Promise<DoctorEarningsDTO[]>;
}

export class GetDoctorEarningsUseCase implements IGetDoctorEarningsUseCase {
    constructor(private _orderRepository: IOrderRepository) { }

    async execute(
        page: number,
        limit: number,
        startDate?: string,
        endDate?: string
    ): Promise<DoctorEarningsDTO[]> {
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

        return await this._orderRepository.getDoctorEarningsList(
            page,
            limit,
            start,
            end
        );
    }
}
