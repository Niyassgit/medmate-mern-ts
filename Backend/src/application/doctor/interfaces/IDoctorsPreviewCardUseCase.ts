import { DoctorPreviewForGuestDTO } from "../dto/DoctorPreviewForGuestDTO";

export interface IDoctorsPreviewUseCase{
    execute():Promise<DoctorPreviewForGuestDTO[]>
}