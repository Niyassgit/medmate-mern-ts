import { PrescriptionDetailsDTO } from "../../guest/interefaces/PrescriptionDetailsDTO";

export interface IGetAllPrescriptionsMadeUseCase {
    execute(
        userId?: string,
        page?: number,
        limit?: number
    ): Promise<{ prescriptions: PrescriptionDetailsDTO[]; total: number }>;
}
