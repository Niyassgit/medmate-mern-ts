import { DoctorBody } from "./DoctorBody";

export interface DoctorResponseBody{
  doctors: DoctorBody[];
  total: number;
  page: number;
  limit: number;
};
