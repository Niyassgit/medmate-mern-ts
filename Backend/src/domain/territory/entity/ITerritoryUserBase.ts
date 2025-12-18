import { Role } from "../../../shared/Enums";

export interface ITerritoryUserBase {
  id: string;
  name: string;
  phone?: string;
  role: Role;
  department?: string;
}
