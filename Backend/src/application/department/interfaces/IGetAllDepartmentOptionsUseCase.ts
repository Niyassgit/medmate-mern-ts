import { TerritoryOptionsDTO } from "../../territory/dto/TerritoryOptionsDTO";

export interface IGetAllDepartmentOptionsUseCase{
    execute():Promise<TerritoryOptionsDTO[] | null>
}