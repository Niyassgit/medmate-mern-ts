import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { StatusSummaryDTO } from "../dto/StatsSummaryDTO";
import { IGetAdminDashBoardSummaryUseCase } from "../interfaces/IGetAdminDashboardSummaryUseCase";

export class GetAdminDashboardSummaryUseCase implements IGetAdminDashBoardSummaryUseCase{
    constructor(
        private _medicalRepRepository:IMedicalRepRepository,
        private _doctorRepository:IDoctorRepository,
        private _subscriptionHistoryRepository:ISubscript
    ){}
    async execute(userId?: string): Promise<StatusSummaryDTO> {
        
    }
}