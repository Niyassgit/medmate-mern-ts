import { DepartmentDTO } from "./DepartmentDTO";

export interface DepartmentApiResponse {
  success: boolean;
  data: {
    departments: DepartmentDTO[];
    total: number;
  };
  page: number;
  limit: number;
}