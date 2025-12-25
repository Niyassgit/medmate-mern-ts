import { AdminEarningsDTO } from "../dto/AdminEarningsDTO";

export interface IGetAdminEarningsUseCase {
    execute(
        page: number,
        limit: number,
        startDate?: string,
        endDate?: string
    ): Promise<AdminEarningsDTO[]>;
}
