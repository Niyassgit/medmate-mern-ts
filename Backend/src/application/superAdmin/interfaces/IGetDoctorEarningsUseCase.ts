import { DoctorEarningsDTO } from "../dto/DoctorEarningsDTO";

export interface IGetDoctorEarningsUseCase {
    execute(
        page: number,
        limit: number,
        startDate?: string,
        endDate?: string
    ): Promise<DoctorEarningsDTO[]>;
}
