import { Role } from "../../shared/Enums";

export interface TerritoryUsersPrismaResult {
  id: string;
  doctors: {
    id: string;
    name: string;
    phone: string;
    department?: {
      name: string;
    } | null;
  }[];
  guests: {
    id: string;
    name: string;
    phone?: string | null;
  }[];
  repTerritories: {
    rep: {
      id: string;
      name: string;
      phone: string;
      department?: {
        name: string;
      } | null;
    }| null;
  }[];
}
