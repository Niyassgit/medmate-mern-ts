import { Role } from "../../../shared/Enums";

export interface TerritoryDetailsDTO {
  users: {
    id: string;
    name: string;
    role: Role;
    department?: string;
    phone?: string;
  }[];
  count: number;
}
