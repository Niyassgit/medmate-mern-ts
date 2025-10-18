import { Doctor } from "./Doctor";

export interface DoctorResponse{
  doctors: Doctor[];
  total: number;
  page: number;
  limit: number;
};
