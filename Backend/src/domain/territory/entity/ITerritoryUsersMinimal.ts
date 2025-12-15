import { ITerritoryUserBase } from "./ITerritoryUserBase";

export interface ITerritoryUsersMinimal {
  territoryId: string;

  users: ITerritoryUserBase[];
}
