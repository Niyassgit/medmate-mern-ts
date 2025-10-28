import { TerritoriesListDTO } from "../dto/TerritoriesListDTO";

export interface IGetTerritoriesUseCase{
    execute(userId:string,page:number,limit:number,search:string):Promise<TerritoriesListDTO | null>
}