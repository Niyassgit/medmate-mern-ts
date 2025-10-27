import { AnalyticsResponseDTO } from "../dto/AnalyticsResponseDTO";

export interface IDoctorAnalyticsUseCase{
    execute(userId:string):Promise<AnalyticsResponseDTO | null>
}