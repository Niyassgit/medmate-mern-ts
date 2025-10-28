import { DoctorListDTO } from "./DoctorListDTO";

export interface DoctorsListResponseDTO {
  doctors: DoctorListDTO[];
  total: number;
}
