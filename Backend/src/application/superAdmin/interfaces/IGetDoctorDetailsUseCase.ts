import { DoctorDetailsDTO } from "../../doctor/dto/DoctorDetailsDTO";

export interface IGetDoctorDetailsUseCase {
  execute(userId: string): Promise<DoctorDetailsDTO | null>;
}
