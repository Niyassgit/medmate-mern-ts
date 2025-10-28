
import { TerritoryDTO } from "./TerritoryDTO";

export interface TerritoryApiResponse {
  success: boolean;
   data: {
     territories: TerritoryDTO[];
     total: number;
   };
   page: number;
   limit: number;
}